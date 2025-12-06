#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=============================================="
echo "  💾 DEPLOY - DATA TOOLS"
echo "=============================================="
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

# Criar namespace se não existir
echo -e "${YELLOW}📁 Verificando namespace data...${NC}"
kubectl create namespace data --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo -e "${YELLOW}💾 Applying OpenSearch Proxy...${NC}"
kubectl apply -k data/opensearch-proxy/

echo ""
echo -e "${YELLOW}⏳ Waiting for rollout...${NC}"
kubectl rollout status deployment/opensearch-proxy -n data --timeout=120s

echo ""
echo -e "${GREEN}✅ Data tools deployed!${NC}"
echo ""

kubectl get pods -n data

echo ""
echo -e "${YELLOW}🔗 Access OpenSearch Dashboard:${NC}"
echo "  kubectl port-forward svc/opensearch-proxy 9200:80 -n data"
echo "  Open: http://localhost:9200/_dashboards"
echo ""
echo -e "${YELLOW}🔐 Credentials:${NC}"
echo "  User: admin"
echo "  Pass: ProdCompPlat135246OpenSearch!"