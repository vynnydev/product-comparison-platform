#!/bin/bash

# ============================================
# 🔧 CONFIGURE K8S FROM TERRAFORM/AWS
# ============================================
# Este script automaticamente coleta os endpoints
# do Terraform/AWS e configura o Kubernetes
# ============================================

set -e

echo "============================================"
echo "🔧 CONFIGURE K8S FROM TERRAFORM/AWS"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ============================================
# CONFIGURATION
# ============================================
NAMESPACE="product-platform"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="${PROJECT_NAME:-product-comparison}"
ENVIRONMENT="${ENVIRONMENT:-dev}"

# Credenciais (podem ser passadas como variáveis de ambiente)
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-ProdCompPlat135246PostgreSQL}"
MQ_USERNAME="${MQ_USERNAME:-admin}"
MQ_PASSWORD="${MQ_PASSWORD:-ProdCompPlat135246RabbitMQ}"

# Diretório do Terraform (relativo ao script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${TERRAFORM_DIR:-${SCRIPT_DIR}/../infraestructure/terraform}"

# ============================================
# FUNCTIONS
# ============================================

get_rds_endpoint() {
    echo ""
    print_info "Buscando endpoint do RDS..."
    
    # Tentar via Terraform primeiro
    if [[ -d "$TERRAFORM_DIR" ]]; then
        cd "$TERRAFORM_DIR"
        RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null || echo "")
        cd - > /dev/null
    fi
    
    # Se não encontrou via Terraform, usar AWS CLI
    if [[ -z "$RDS_ENDPOINT" ]]; then
        print_warning "Não encontrado via Terraform, buscando via AWS CLI..."
        RDS_ENDPOINT=$(aws rds describe-db-instances \
            --region ${AWS_REGION} \
            --query "DBInstances[?DBInstanceIdentifier=='${PROJECT_NAME}-${ENVIRONMENT}-postgresql'].Endpoint.Address" \
            --output text 2>/dev/null || echo "")
    fi
    
    # Se ainda não encontrou, listar todos e pegar o primeiro que match
    if [[ -z "$RDS_ENDPOINT" ]]; then
        print_warning "Buscando por padrão de nome..."
        RDS_ENDPOINT=$(aws rds describe-db-instances \
            --region ${AWS_REGION} \
            --query "DBInstances[?contains(DBInstanceIdentifier, '${PROJECT_NAME}')].Endpoint.Address" \
            --output text 2>/dev/null | head -1 || echo "")
    fi
    
    if [[ -z "$RDS_ENDPOINT" ]]; then
        print_error "Não foi possível encontrar o endpoint do RDS"
        print_info "Listando instâncias RDS disponíveis:"
        aws rds describe-db-instances --region ${AWS_REGION} --query "DBInstances[*].[DBInstanceIdentifier,Endpoint.Address]" --output table
        read -p "Digite o endpoint do RDS manualmente: " RDS_ENDPOINT
    fi
    
    print_status "RDS Endpoint: $RDS_ENDPOINT"
}

get_mq_endpoint() {
    echo ""
    print_info "Buscando endpoint do Amazon MQ..."
    
    # Tentar via Terraform primeiro
    if [[ -d "$TERRAFORM_DIR" ]]; then
        cd "$TERRAFORM_DIR"
        MQ_ENDPOINT=$(terraform output -raw amazonmq_endpoint 2>/dev/null || echo "")
        cd - > /dev/null
    fi
    
    # Se não encontrou via Terraform, usar AWS CLI
    if [[ -z "$MQ_ENDPOINT" ]]; then
        print_warning "Não encontrado via Terraform, buscando via AWS CLI..."
        
        # Primeiro, pegar o Broker ID
        BROKER_ID=$(aws mq list-brokers \
            --region ${AWS_REGION} \
            --query "BrokerSummaries[?contains(BrokerName, '${PROJECT_NAME}')].BrokerId" \
            --output text 2>/dev/null | head -1 || echo "")
        
        if [[ -n "$BROKER_ID" ]]; then
            # Pegar o endpoint AMQPS do broker
            MQ_ENDPOINT=$(aws mq describe-broker \
                --region ${AWS_REGION} \
                --broker-id "$BROKER_ID" \
                --query "BrokerInstances[0].Endpoints[0]" \
                --output text 2>/dev/null | sed 's/amqps:\/\///' | sed 's/:5671//' || echo "")
        fi
    fi
    
    # Se ainda não encontrou, tentar construir o endpoint padrão
    if [[ -z "$MQ_ENDPOINT" ]]; then
        print_warning "Buscando broker ID..."
        BROKER_ID=$(aws mq list-brokers \
            --region ${AWS_REGION} \
            --query "BrokerSummaries[0].BrokerId" \
            --output text 2>/dev/null || echo "")
        
        if [[ -n "$BROKER_ID" && "$BROKER_ID" != "None" ]]; then
            MQ_ENDPOINT="${BROKER_ID}.mq.${AWS_REGION}.amazonaws.com"
        fi
    fi
    
    if [[ -z "$MQ_ENDPOINT" ]]; then
        print_error "Não foi possível encontrar o endpoint do Amazon MQ"
        print_info "Listando brokers disponíveis:"
        aws mq list-brokers --region ${AWS_REGION} --query "BrokerSummaries[*].[BrokerName,BrokerId]" --output table
        read -p "Digite o Broker ID do Amazon MQ: " BROKER_ID
        MQ_ENDPOINT="${BROKER_ID}.mq.${AWS_REGION}.amazonaws.com"
    fi
    
    print_status "MQ Endpoint: $MQ_ENDPOINT"
}

check_namespace() {
    echo ""
    print_info "Verificando namespace..."
    
    if ! kubectl get namespace ${NAMESPACE} &> /dev/null; then
        print_warning "Namespace ${NAMESPACE} não existe. Criando..."
        kubectl create namespace ${NAMESPACE}
    fi
    
    print_status "Namespace ${NAMESPACE} OK"
}

create_configmaps() {
    echo ""
    print_info "Criando/Atualizando ConfigMaps..."
    
    # ConfigMap compartilhado
    kubectl create configmap shared-config \
        --namespace ${NAMESPACE} \
        --from-literal=SPRING_PROFILES_ACTIVE=cloud \
        --from-literal=DB_HOST=${RDS_ENDPOINT} \
        --from-literal=DB_PORT=5432 \
        --from-literal=DB_NAME=productdb \
        --from-literal=RABBITMQ_HOST=${MQ_ENDPOINT} \
        --from-literal=RABBITMQ_PORT=5671 \
        --from-literal=SERVER_PORT=8080 \
        --from-literal=LOGGING_LEVEL_ROOT=INFO \
        --from-literal=LOGGING_LEVEL_COM_HACKERRANK=DEBUG \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "ConfigMap shared-config criado/atualizado"
    
    # ConfigMap do product-service
    kubectl create configmap product-service-config \
        --namespace ${NAMESPACE} \
        --from-literal=PRODUCT_SERVICE_NAME=product-service \
        --from-literal=RABBITMQ_EXCHANGE=products.exchange \
        --from-literal=RABBITMQ_QUEUE=product.events \
        --from-literal=RABBITMQ_ROUTING_KEY=product.created \
        --from-literal=CACHE_ENABLED=false \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "ConfigMap product-service-config criado/atualizado"
    
    # ConfigMap do ai-service
    kubectl create configmap ai-service-config \
        --namespace ${NAMESPACE} \
        --from-literal=AI_SERVICE_NAME=ai-service \
        --from-literal=SERVER_PORT=8081 \
        --from-literal=AI_ENABLED=true \
        --from-literal=AI_PROVIDER=bedrock \
        --from-literal=AI_BEDROCK_REGION=${AWS_REGION} \
        --from-literal=AI_BEDROCK_MODEL=anthropic.claude-3-5-sonnet-20241022-v2:0 \
        --from-literal=RABBITMQ_EXCHANGE=products.exchange \
        --from-literal=RABBITMQ_QUEUE=product.events \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "ConfigMap ai-service-config criado/atualizado"
}

create_secrets() {
    echo ""
    print_info "Criando/Atualizando Secrets..."
    
    # Secret do banco de dados
    kubectl create secret generic db-credentials \
        --namespace ${NAMESPACE} \
        --from-literal=DB_USERNAME=${DB_USERNAME} \
        --from-literal=DB_PASSWORD=${DB_PASSWORD} \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "Secret db-credentials criado/atualizado"
    
    # Secret do RabbitMQ
    kubectl create secret generic rabbitmq-credentials \
        --namespace ${NAMESPACE} \
        --from-literal=RABBITMQ_USERNAME=${MQ_USERNAME} \
        --from-literal=RABBITMQ_PASSWORD=${MQ_PASSWORD} \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "Secret rabbitmq-credentials criado/atualizado"
}

restart_deployments() {
    echo ""
    print_info "Reiniciando deployments..."
    
    kubectl rollout restart deployment/product-service -n ${NAMESPACE} 2>/dev/null || print_warning "product-service não encontrado"
    kubectl rollout restart deployment/ai-service -n ${NAMESPACE} 2>/dev/null || print_warning "ai-service não encontrado"
    
    print_status "Deployments reiniciados"
}

show_summary() {
    echo ""
    echo "============================================"
    echo "✅ CONFIGURAÇÃO COMPLETA!"
    echo "============================================"
    echo ""
    echo "📋 Configurações aplicadas:"
    echo "   ├─ RDS Endpoint:  ${RDS_ENDPOINT}"
    echo "   ├─ RDS Port:      5432"
    echo "   ├─ RDS Database:  productdb"
    echo "   ├─ RDS Username:  ${DB_USERNAME}"
    echo "   ├─ MQ Endpoint:   ${MQ_ENDPOINT}"
    echo "   ├─ MQ Port:       5671 (SSL)"
    echo "   └─ MQ Username:   ${MQ_USERNAME}"
    echo ""
    echo "🔍 Verificar com:"
    echo "   kubectl get configmap -n ${NAMESPACE}"
    echo "   kubectl get secrets -n ${NAMESPACE}"
    echo "   kubectl get pods -n ${NAMESPACE}"
    echo ""
    echo "📊 Ver logs:"
    echo "   kubectl logs -f deployment/product-service -n ${NAMESPACE}"
    echo "   kubectl logs -f deployment/ai-service -n ${NAMESPACE}"
    echo ""
}

install_metrics_server() {
    echo ""
    print_info "Verificando Metrics Server..."
    
    if ! kubectl get deployment metrics-server -n kube-system &> /dev/null; then
        print_warning "Metrics Server não instalado. Instalando..."
        kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
        print_status "Metrics Server instalado"
    else
        print_status "Metrics Server já está instalado"
    fi
}

# ============================================
# MAIN
# ============================================

echo ""
print_info "Iniciando configuração automática..."
print_info "Região: ${AWS_REGION}"
print_info "Projeto: ${PROJECT_NAME}-${ENVIRONMENT}"

# Verificar pré-requisitos
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl não encontrado"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI não encontrado"
    exit 1
fi

# Executar passos
get_rds_endpoint
get_mq_endpoint
check_namespace
create_configmaps
create_secrets
install_metrics_server
restart_deployments
show_summary