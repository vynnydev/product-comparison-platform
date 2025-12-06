#!/bin/bash

# ============================================
# DEPLOY DISASTER RECOVERY
# Script para deploy dos recursos de DR
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
K8S_DIR="${PROJECT_ROOT}/k8s"

# Funções de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}\n"
}

# Verificar pré-requisitos
check_prerequisites() {
    log_step "🔍 Verificando pré-requisitos..."
    
    # Verificar kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl não encontrado. Por favor, instale o kubectl."
        exit 1
    fi
    log_success "kubectl encontrado: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
    
    # Verificar conexão com cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Não foi possível conectar ao cluster Kubernetes."
        log_info "Execute: aws eks update-kubeconfig --region us-east-1 --name <cluster-name>"
        exit 1
    fi
    log_success "Conectado ao cluster Kubernetes"
    
    # Verificar se os diretórios existem
    if [ ! -d "${K8S_DIR}/security" ]; then
        log_error "Diretório k8s/security não encontrado."
        exit 1
    fi
    log_success "Diretórios de configuração encontrados"
}

# Criar namespace security se não existir
create_namespace() {
    log_step "📁 Criando namespace security..."
    
    if kubectl get namespace security &> /dev/null; then
        log_info "Namespace 'security' já existe"
    else
        kubectl create namespace security
        log_success "Namespace 'security' criado"
    fi
    
    # Labels para o namespace
    kubectl label namespace security \
        app.kubernetes.io/name=security \
        app.kubernetes.io/part-of=product-comparison \
        --overwrite
    
    log_success "Labels aplicados ao namespace"
}

# Deploy AWS Integration (GuardDuty, WAF, Shield)
deploy_aws_integration() {
    log_step "🔐 Deploying AWS Integration..."
    
    local AWS_INTEGRATION_DIR="${K8S_DIR}/security/aws-integration"
    
    if [ ! -d "${AWS_INTEGRATION_DIR}" ]; then
        log_warning "Diretório aws-integration não encontrado. Pulando..."
        return
    fi
    
    # GuardDuty Events Processor
    if [ -f "${AWS_INTEGRATION_DIR}/guardduty-events.yaml" ]; then
        log_info "Aplicando GuardDuty Events Processor..."
        kubectl apply -f "${AWS_INTEGRATION_DIR}/guardduty-events.yaml"
        log_success "GuardDuty Events Processor aplicado"
    fi
    
    # WAF Dashboard/Exporter
    if [ -f "${AWS_INTEGRATION_DIR}/waf-dashboard.yaml" ]; then
        log_info "Aplicando WAF Dashboard..."
        kubectl apply -f "${AWS_INTEGRATION_DIR}/waf-dashboard.yaml"
        log_success "WAF Dashboard aplicado"
    fi
    
    # Shield Metrics Exporter
    if [ -f "${AWS_INTEGRATION_DIR}/shield-metrics.yaml" ]; then
        log_info "Aplicando Shield Metrics Exporter..."
        kubectl apply -f "${AWS_INTEGRATION_DIR}/shield-metrics.yaml"
        log_success "Shield Metrics Exporter aplicado"
    fi
}

# Deploy Alerting (Discord, Slack)
deploy_alerting() {
    log_step "🔔 Deploying Alerting..."
    
    local ALERTING_DIR="${K8S_DIR}/security/alerting"
    
    if [ ! -d "${ALERTING_DIR}" ]; then
        log_warning "Diretório alerting não encontrado. Pulando..."
        return
    fi
    
    # Secrets primeiro
    if [ -f "${ALERTING_DIR}/discord-webhook-secret.yaml" ]; then
        log_info "Aplicando Discord Webhook Secret..."
        kubectl apply -f "${ALERTING_DIR}/discord-webhook-secret.yaml"
        log_success "Discord Webhook Secret aplicado"
    fi
    
    if [ -f "${ALERTING_DIR}/slack-webhook-secret.yaml" ]; then
        log_info "Aplicando Slack Webhook Secret..."
        kubectl apply -f "${ALERTING_DIR}/slack-webhook-secret.yaml"
        log_success "Slack Webhook Secret aplicado"
    fi
    
    # Alertmanager Config
    if [ -f "${ALERTING_DIR}/alertmanager-config.yaml" ]; then
        log_info "Aplicando Alertmanager Config..."
        kubectl apply -f "${ALERTING_DIR}/alertmanager-config.yaml"
        log_success "Alertmanager Config aplicado"
    fi
    
    # Discord Webhook Adapter
    if [ -f "${ALERTING_DIR}/discord-webhook-adapter.yaml" ]; then
        log_info "Aplicando Discord Webhook Adapter..."
        kubectl apply -f "${ALERTING_DIR}/discord-webhook-adapter.yaml"
        log_success "Discord Webhook Adapter aplicado"
    fi
    
    # Prometheus Rules
    if [ -f "${ALERTING_DIR}/prometheus-rules.yaml" ]; then
        log_info "Aplicando Prometheus Rules..."
        kubectl apply -f "${ALERTING_DIR}/prometheus-rules.yaml"
        log_success "Prometheus Rules aplicado"
    fi
}

# Deploy Disaster Recovery Controller
deploy_dr_controller() {
    log_step "🆘 Deploying Disaster Recovery Controller..."
    
    local DR_DIR="${K8S_DIR}/security/disaster-recovery"
    
    if [ ! -d "${DR_DIR}" ]; then
        log_warning "Diretório disaster-recovery não encontrado. Pulando..."
        return
    fi
    
    # ConfigMap primeiro
    if [ -f "${DR_DIR}/configmap.yaml" ]; then
        log_info "Aplicando DR ConfigMap..."
        kubectl apply -f "${DR_DIR}/configmap.yaml"
        log_success "DR ConfigMap aplicado"
    fi
    
    # Controller Deployment
    if [ -f "${DR_DIR}/controller-deployment.yaml" ]; then
        log_info "Aplicando DR Controller Deployment..."
        kubectl apply -f "${DR_DIR}/controller-deployment.yaml"
        log_success "DR Controller Deployment aplicado"
    fi
    
    # Aplicar via kustomize se existir
    if [ -f "${DR_DIR}/kustomization.yaml" ]; then
        log_info "Aplicando via Kustomize..."
        kubectl apply -k "${DR_DIR}"
        log_success "Kustomize aplicado"
    fi
}

# Deploy FinOps
deploy_finops() {
    log_step "💰 Deploying FinOps..."
    
    local FINOPS_DIR="${K8S_DIR}/finops"
    
    if [ ! -d "${FINOPS_DIR}" ]; then
        log_warning "Diretório finops não encontrado. Pulando..."
        return
    fi
    
    # Criar namespace finops
    if kubectl get namespace finops &> /dev/null; then
        log_info "Namespace 'finops' já existe"
    else
        kubectl create namespace finops
        log_success "Namespace 'finops' criado"
    fi
    
    # Aplicar via kustomize
    if [ -f "${FINOPS_DIR}/kustomization.yaml" ]; then
        log_info "Aplicando FinOps via Kustomize..."
        kubectl apply -k "${FINOPS_DIR}"
        log_success "FinOps aplicado"
    else
        # Aplicar arquivos individualmente
        if [ -f "${FINOPS_DIR}/namespace.yaml" ]; then
            kubectl apply -f "${FINOPS_DIR}/namespace.yaml"
        fi
        
        if [ -d "${FINOPS_DIR}/cost-exporter" ]; then
            kubectl apply -k "${FINOPS_DIR}/cost-exporter/"
        fi
        
        if [ -d "${FINOPS_DIR}/grafana-dashboard" ]; then
            kubectl apply -f "${FINOPS_DIR}/grafana-dashboard/"
        fi
        
        log_success "FinOps aplicado"
    fi
}

# Verificar status dos deployments
verify_deployments() {
    log_step "✅ Verificando Deployments..."
    
    echo -e "\n${CYAN}Security Namespace:${NC}"
    kubectl get deployments -n security 2>/dev/null || log_warning "Nenhum deployment em security"
    
    echo -e "\n${CYAN}FinOps Namespace:${NC}"
    kubectl get deployments -n finops 2>/dev/null || log_warning "Nenhum deployment em finops"
    
    echo -e "\n${CYAN}Pods em Security:${NC}"
    kubectl get pods -n security 2>/dev/null || log_warning "Nenhum pod em security"
    
    echo -e "\n${CYAN}Pods em FinOps:${NC}"
    kubectl get pods -n finops 2>/dev/null || log_warning "Nenhum pod em finops"
    
    echo -e "\n${CYAN}Services em Security:${NC}"
    kubectl get svc -n security 2>/dev/null || log_warning "Nenhum service em security"
    
    echo -e "\n${CYAN}Services em FinOps:${NC}"
    kubectl get svc -n finops 2>/dev/null || log_warning "Nenhum service em finops"
}

# Aguardar pods ficarem ready
wait_for_pods() {
    log_step "⏳ Aguardando pods ficarem ready..."
    
    local namespaces=("security" "finops")
    local timeout=300  # 5 minutos
    
    for ns in "${namespaces[@]}"; do
        log_info "Verificando namespace: $ns"
        
        # Verificar se existem pods no namespace
        pod_count=$(kubectl get pods -n "$ns" --no-headers 2>/dev/null | wc -l)
        
        if [ "$pod_count" -eq 0 ]; then
            log_warning "Nenhum pod encontrado em $ns"
            continue
        fi
        
        # Aguardar pods ficarem ready
        if kubectl wait --for=condition=ready pod \
            --all \
            -n "$ns" \
            --timeout="${timeout}s" 2>/dev/null; then
            log_success "Todos os pods em $ns estão ready"
        else
            log_warning "Alguns pods em $ns não ficaram ready no tempo limite"
        fi
    done
}

# Mostrar informações de acesso
show_access_info() {
    log_step "📋 Informações de Acesso"
    
    echo -e "${CYAN}DR Controller:${NC}"
    echo "  kubectl port-forward svc/disaster-recovery-controller 8080:8080 -n security"
    echo "  URL: http://localhost:8080"
    
    echo -e "\n${CYAN}WAF Exporter Metrics:${NC}"
    echo "  kubectl port-forward svc/waf-exporter 9090:9090 -n security"
    echo "  URL: http://localhost:9090/metrics"
    
    echo -e "\n${CYAN}Shield Exporter Metrics:${NC}"
    echo "  kubectl port-forward svc/shield-exporter 9091:9091 -n security"
    echo "  URL: http://localhost:9091/metrics"
    
    echo -e "\n${CYAN}Cost Exporter Metrics:${NC}"
    echo "  kubectl port-forward svc/cost-exporter 9090:9090 -n finops"
    echo "  URL: http://localhost:9090/metrics"
    
    echo -e "\n${CYAN}Discord Webhook Adapter:${NC}"
    echo "  kubectl port-forward svc/discord-webhook-adapter 9095:9095 -n security"
    echo "  URL: http://localhost:9095/webhook"
}

# Cleanup (opcional)
cleanup() {
    log_step "🧹 Cleanup (remover recursos)..."
    
    read -p "Tem certeza que deseja remover todos os recursos de DR? (y/N): " confirm
    
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Removendo recursos..."
        
        kubectl delete -k "${K8S_DIR}/finops/" --ignore-not-found=true
        kubectl delete -k "${K8S_DIR}/security/disaster-recovery/" --ignore-not-found=true
        kubectl delete -f "${K8S_DIR}/security/alerting/" --ignore-not-found=true
        kubectl delete -f "${K8S_DIR}/security/aws-integration/" --ignore-not-found=true
        
        log_success "Recursos removidos"
    else
        log_info "Cleanup cancelado"
    fi
}

# Help
show_help() {
    echo -e "${CYAN}Deploy Disaster Recovery Script${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos:"
    echo "  all             Deploy todos os componentes (padrão)"
    echo "  aws-integration Deploy apenas AWS Integration"
    echo "  alerting        Deploy apenas Alerting"
    echo "  dr-controller   Deploy apenas DR Controller"
    echo "  finops          Deploy apenas FinOps"
    echo "  verify          Verificar status dos deployments"
    echo "  cleanup         Remover todos os recursos"
    echo "  help            Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0              # Deploy completo"
    echo "  $0 all          # Deploy completo"
    echo "  $0 finops       # Deploy apenas FinOps"
    echo "  $0 verify       # Verificar status"
}

# Main
main() {
    local command="${1:-all}"
    
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║         🆘 DISASTER RECOVERY DEPLOYMENT SCRIPT 🆘            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    case "$command" in
        all)
            check_prerequisites
            create_namespace
            deploy_aws_integration
            deploy_alerting
            deploy_dr_controller
            deploy_finops
            wait_for_pods
            verify_deployments
            show_access_info
            ;;
        aws-integration)
            check_prerequisites
            create_namespace
            deploy_aws_integration
            ;;
        alerting)
            check_prerequisites
            create_namespace
            deploy_alerting
            ;;
        dr-controller)
            check_prerequisites
            create_namespace
            deploy_dr_controller
            ;;
        finops)
            check_prerequisites
            deploy_finops
            ;;
        verify)
            verify_deployments
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Comando desconhecido: $command"
            show_help
            exit 1
            ;;
    esac
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Script finalizado com sucesso!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

# Executar
main "$@"