#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=============================================="
echo "  🚀 DEPLOY - MICROSERVICES & FRONTEND"
echo "  Product Comparison Platform"
echo "=============================================="
echo -e "${NC}"

# Diretório base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

# Verificar conexão com cluster
echo -e "${YELLOW}📡 Verificando conexão com cluster...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Não foi possível conectar ao cluster Kubernetes${NC}"
    echo "Execute: aws eks update-kubeconfig --name product-comparison-dev --region us-east-1"
    exit 1
fi
echo -e "${GREEN}✅ Conectado ao cluster${NC}"
echo ""

# Verificar se namespace existe
echo -e "${YELLOW}📁 Verificando namespace product-platform...${NC}"
if ! kubectl get namespace product-platform &> /dev/null; then
    echo -e "${YELLOW}Criando namespace product-platform...${NC}"
    kubectl create namespace product-platform
fi
echo -e "${GREEN}✅ Namespace pronto${NC}"
echo ""

# Verificar se shared-config existe
echo -e "${YELLOW}🔧 Verificando ConfigMaps e Secrets compartilhados...${NC}"
if ! kubectl get configmap shared-config -n product-platform &> /dev/null; then
    echo -e "${YELLOW}⚠️  ConfigMap shared-config não encontrado${NC}"
    echo -e "${YELLOW}   Certifique-se de que o base/infrastructure está aplicado${NC}"
fi

if ! kubectl get secret db-credentials -n product-platform &> /dev/null; then
    echo -e "${YELLOW}⚠️  Secret db-credentials não encontrado${NC}"
fi

if ! kubectl get secret rabbitmq-credentials -n product-platform &> /dev/null; then
    echo -e "${YELLOW}⚠️  Secret rabbitmq-credentials não encontrado${NC}"
fi
echo ""

# Deploy Product Service
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 [1/4] Deploying Product Service...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl apply -k apps/product-service/
echo -e "${GREEN}✅ Product Service aplicado${NC}"
echo ""

# Deploy AI Service
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🤖 [2/4] Deploying AI Service...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl apply -k apps/ai-service/
echo -e "${GREEN}✅ AI Service aplicado${NC}"
echo ""

# Deploy Search Service
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔍 [3/4] Deploying Search Service...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl apply -k apps/search-service/
echo -e "${GREEN}✅ Search Service aplicado${NC}"
echo ""

# Deploy Frontend
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🎨 [4/4] Deploying Frontend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl apply -k apps/frontend/
echo -e "${GREEN}✅ Frontend aplicado${NC}"
echo ""

# Aguardar pods ficarem prontos
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⏳ Aguardando pods ficarem prontos...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Aguardar cada deployment
echo -e "${YELLOW}  ⏳ Product Service...${NC}"
kubectl rollout status deployment/product-service -n product-platform --timeout=180s || true

echo -e "${YELLOW}  ⏳ AI Service...${NC}"
kubectl rollout status deployment/ai-service -n product-platform --timeout=180s || true

echo -e "${YELLOW}  ⏳ Search Service...${NC}"
kubectl rollout status deployment/search-service -n product-platform --timeout=180s || true

echo -e "${YELLOW}  ⏳ Frontend...${NC}"
kubectl rollout status deployment/frontend -n product-platform --timeout=180s || true

echo ""

# Status final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 STATUS FINAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

kubectl get pods -n product-platform -o wide

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📋 SERVICES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

kubectl get svc -n product-platform

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📈 HPA (Horizontal Pod Autoscaler)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

kubectl get hpa -n product-platform

echo ""
echo -e "${GREEN}=============================================="
echo "  ✅ DEPLOY CONCLUÍDO!"
echo "==============================================${NC}"
echo ""
echo -e "${YELLOW}🔗 Para acessar os serviços localmente:${NC}"
echo ""
echo "  # Product Service (API)"
echo "  kubectl port-forward svc/product-service 8080:8080 -n product-platform"
echo ""
echo "  # AI Service"
echo "  kubectl port-forward svc/ai-service 8081:8081 -n product-platform"
echo ""
echo "  # Search Service"
echo "  kubectl port-forward svc/search-service 8082:8082 -n product-platform"
echo ""
echo "  # Frontend"
echo "  kubectl port-forward svc/frontend 3000:3000 -n product-platform"
echo ""