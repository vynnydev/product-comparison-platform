#!/bin/bash
# ============================================
# INSTALL ARGOCD ON EKS
# GitOps Continuous Delivery
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ARGOCD_VERSION="v2.9.3"
NAMESPACE="argocd"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           ARGOCD INSTALLATION FOR EKS                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# 1. CREATE NAMESPACE
# ============================================
echo -e "${GREEN}📦 Creating ArgoCD namespace...${NC}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# ============================================
# 2. INSTALL ARGOCD
# ============================================
echo -e "${GREEN}🚀 Installing ArgoCD ${ARGOCD_VERSION}...${NC}"
kubectl apply -n ${NAMESPACE} -f https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml

# ============================================
# 3. WAIT FOR ARGOCD TO BE READY
# ============================================
echo -e "${YELLOW}⏳ Waiting for ArgoCD components to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/argocd-repo-server -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/argocd-applicationset-controller -n ${NAMESPACE}

# ============================================
# 4. EXPOSE ARGOCD SERVER (LoadBalancer)
# ============================================
echo -e "${GREEN}🌐 Exposing ArgoCD Server via LoadBalancer...${NC}"
kubectl patch svc argocd-server -n ${NAMESPACE} -p '{"spec": {"type": "LoadBalancer"}}'

# ============================================
# 5. GET INITIAL ADMIN PASSWORD
# ============================================
echo -e "${YELLOW}⏳ Waiting for LoadBalancer to be provisioned...${NC}"
sleep 30

ARGOCD_PASSWORD=$(kubectl -n ${NAMESPACE} get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
ARGOCD_URL=$(kubectl get svc argocd-server -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# ============================================
# 6. INSTALL ARGOCD CLI (Optional)
# ============================================
echo -e "${GREEN}📥 Installing ArgoCD CLI...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install argocd 2>/dev/null || echo "ArgoCD CLI already installed or brew not available"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    curl -sSL -o /tmp/argocd https://github.com/argoproj/argo-cd/releases/download/${ARGOCD_VERSION}/argocd-linux-amd64
    sudo install -m 555 /tmp/argocd /usr/local/bin/argocd
    rm /tmp/argocd
fi

# ============================================
# 7. PRINT SUMMARY
# ============================================
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ARGOCD INSTALLATION COMPLETE! 🎉                ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 ArgoCD Access Information:${NC}"
echo -e "   URL:      ${YELLOW}https://${ARGOCD_URL}${NC}"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}${ARGOCD_PASSWORD}${NC}"
echo ""
echo -e "${BLUE}📌 Next Steps:${NC}"
echo "   1. Access ArgoCD UI at the URL above"
echo "   2. Login with admin credentials"
echo "   3. Change the admin password"
echo "   4. Add your Git repository"
echo "   5. Deploy applications using ArgoCD"
echo ""
echo -e "${BLUE}🔧 CLI Login:${NC}"
echo "   argocd login ${ARGOCD_URL} --username admin --password '${ARGOCD_PASSWORD}' --insecure"
echo ""
echo -e "${BLUE}🔐 Change Password:${NC}"
echo "   argocd account update-password"
echo ""

# Save credentials to file
cat > argocd-credentials.txt << EOF
ArgoCD Access Information
========================
URL: https://${ARGOCD_URL}
Username: admin
Password: ${ARGOCD_PASSWORD}

CLI Login:
argocd login ${ARGOCD_URL} --username admin --password '${ARGOCD_PASSWORD}' --insecure
EOF

echo -e "${GREEN}💾 Credentials saved to: argocd-credentials.txt${NC}"