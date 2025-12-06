#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║  🚀 FULL DEPLOY - PRODUCT COMPARISON PLATFORM ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

# Verificar conexão
echo -e "${YELLOW}📡 Verificando conexão com cluster...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Não foi possível conectar ao cluster${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Conectado!${NC}"
echo ""

# Menu de opções
echo -e "${YELLOW}Selecione o que deseja instalar:${NC}"
echo ""
echo "  1) Tudo (Monitoring + ArgoCD + Apps + Data)"
echo "  2) Apenas Microserviços e Frontend"
echo "  3) Apenas Monitoring"
echo "  4) Apenas ArgoCD"
echo "  5) Apenas Data Tools"
echo ""
read -p "Opção [1]: " option
option=${option:-1}

case $option in
    1)
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}📊 [1/4] Deploying Monitoring Stack...${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        kubectl apply -k monitoring/
        echo -e "${GREEN}✅ Monitoring aplicado${NC}"
        
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}🔄 [2/4] Deploying ArgoCD...${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        kubectl apply -k argocd/
        echo -e "${GREEN}✅ ArgoCD aplicado${NC}"
        
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}📦 [3/4] Deploying Microservices & Frontend...${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        kubectl apply -k apps/
        echo -e "${GREEN}✅ Apps aplicados${NC}"
        
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}💾 [4/4] Deploying Data Tools...${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        kubectl create namespace data --dry-run=client -o yaml | kubectl apply -f -
        kubectl apply -k data/
        echo -e "${GREEN}✅ Data tools aplicados${NC}"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}📦 Deploying Microservices & Frontend...${NC}"
        kubectl apply -k apps/
        echo -e "${GREEN}✅ Apps aplicados${NC}"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}📊 Deploying Monitoring Stack...${NC}"
        kubectl apply -k monitoring/
        echo -e "${GREEN}✅ Monitoring aplicado${NC}"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}🔄 Deploying ArgoCD...${NC}"
        kubectl apply -k argocd/
        echo -e "${GREEN}✅ ArgoCD aplicado${NC}"
        ;;
    5)
        echo ""
        echo -e "${YELLOW}💾 Deploying Data Tools...${NC}"
        kubectl create namespace data --dry-run=client -o yaml | kubectl apply -f -
        kubectl apply -k data/
        echo -e "${GREEN}✅ Data tools aplicados${NC}"
        ;;
    *)
        echo -e "${RED}Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}⏳ Aguardando pods...${NC}"
sleep 10

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗"
echo "║              ✅ DEPLOY CONCLUÍDO!             ║"
echo "╚══════════════════════════════════════════════╝${NC}"
echo ""

# Mostrar status
"$SCRIPT_DIR/status.sh" 2>/dev/null || kubectl get pods -A | grep -E "(product-platform|monitoring|argocd|data)"