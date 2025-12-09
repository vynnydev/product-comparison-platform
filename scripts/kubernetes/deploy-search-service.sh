#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=============================================="
echo "  🔍 DEPLOY - SEARCH SERVICE"
echo "=============================================="
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

echo -e "${YELLOW}🔍 Applying Search Service...${NC}"
kubectl apply -k ../../k8s/apps/search-service/

echo ""
echo -e "${YELLOW}⏳ Waiting for rollout...${NC}"
kubectl rollout status deployment/search-service -n product-platform --timeout=180s

echo ""
echo -e "${GREEN}✅ Search Service deployed!${NC}"
echo ""

kubectl get pods -n product-platform -l app=search-service

echo ""
echo -e "${YELLOW}🔗 Access:${NC}"
echo "  kubectl port-forward svc/search-service 8082:8082 -n product-platform"
echo "  curl http://localhost:8082/actuator/health"