#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║  🔐 DEPLOY - SECURITY STACK                  ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$(dirname "$SCRIPT_DIR")"

cd "$K8S_DIR"

echo -e "${YELLOW}📁 Creating security namespace...${NC}"
kubectl apply -f security/namespace.yaml

echo ""
echo -e "${YELLOW}🔐 Deploying Security Stack...${NC}"
kubectl apply -k security/

echo ""
echo -e "${YELLOW}⏳ Waiting for pods to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=security-dashboard -n security --timeout=120s || true
kubectl wait --for=condition=ready pod -l app=disaster-recovery-controller -n security --timeout=120s || true

echo ""
echo -e "${GREEN}✅ Security Stack deployed!${NC}"
echo ""

kubectl get pods -n security

echo ""
echo -e "${YELLOW}🔗 Access Security Dashboard:${NC}"
echo "  kubectl port-forward svc/security-dashboard 3002:3000 -n security"
echo "  Open: http://localhost:3002"
echo ""
echo -e "${YELLOW}🔐 Credentials:${NC}"
echo "  User: admin"
echo "  Pass: SecDash135246!"