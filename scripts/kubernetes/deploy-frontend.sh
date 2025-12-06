#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=============================================="
echo "  🎨 DEPLOY - FRONTEND"
echo "=============================================="
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

echo -e "${YELLOW}🎨 Applying Frontend...${NC}"
kubectl apply -k apps/frontend/

echo ""
echo -e "${YELLOW}⏳ Waiting for rollout...${NC}"
kubectl rollout status deployment/frontend -n product-platform --timeout=180s

echo ""
echo -e "${GREEN}✅ Frontend deployed!${NC}"
echo ""

kubectl get pods -n product-platform -l app=frontend

echo ""
echo -e "${YELLOW}🔗 Access:${NC}"
echo "  kubectl port-forward svc/frontend 3000:3000 -n product-platform"
echo "  Open: http://localhost:3000"