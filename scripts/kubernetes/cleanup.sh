#!/bin/bash

RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}"
echo "╔══════════════════════════════════════════════╗"
echo "║  🗑️  CLEANUP - REMOVE RESOURCES              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

echo -e "${YELLOW}⚠️  ATENÇÃO: Esta ação irá remover recursos do cluster!${NC}"
echo ""
echo "Selecione o que deseja remover:"
echo ""
echo "  1) Microservices e Frontend"
echo "  2) Monitoring Stack"
echo "  3) ArgoCD"
echo "  4) Data Tools"
echo "  5) TUDO"
echo "  0) Cancelar"
echo ""
read -p "Opção: " option

case $option in
    1)
        echo -e "${YELLOW}Removendo Microservices...${NC}"
        kubectl delete -k ../../k8s/apps/ --ignore-not-found
        echo -e "${RED}✅ Microservices removidos${NC}"
        ;;
    2)
        echo -e "${YELLOW}Removendo Monitoring...${NC}"
        kubectl delete -k ../../k8s/monitoring/ --ignore-not-found
        echo -e "${RED}✅ Monitoring removido${NC}"
        ;;
    3)
        echo -e "${YELLOW}Removendo ArgoCD...${NC}"
        kubectl delete -k ../../k8s/argocd/ --ignore-not-found
        echo -e "${RED}✅ ArgoCD removido${NC}"
        ;;
    4)
        echo -e "${YELLOW}Removendo Data Tools...${NC}"
        kubectl delete -k ../../k8s/data/ --ignore-not-found
        echo -e "${RED}✅ Data Tools removidos${NC}"
        ;;
    5)
        read -p "Tem certeza que deseja remover TUDO? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo -e "${YELLOW}Removendo TUDO...${NC}"
            kubectl delete -k ../../k8s/apps/ --ignore-not-found
            kubectl delete -k ../../k8s/monitoring/ --ignore-not-found
            kubectl delete -k ../../k8s/argocd/ --ignore-not-found
            kubectl delete -k ../../k8s/data/ --ignore-not-found
            echo -e "${RED}✅ Tudo removido${NC}"
        else
            echo "Cancelado"
        fi
        ;;
    0)
        echo "Cancelado"
        exit 0
        ;;
    *)
        echo "Opção inválida"
        exit 1
        ;;
esac