#!/bin/bash
# ============================================
# CONFIGURE IRSA FOR AI-SERVICE
# Run after terraform apply
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Configuring IRSA for AI Service...${NC}"

# Get values from Terraform
BEDROCK_ROLE_ARN=$(terraform output -raw bedrock_role_arn 2>/dev/null || echo "")

if [ -z "$BEDROCK_ROLE_ARN" ]; then
    echo -e "${RED}❌ Error: Could not get bedrock_role_arn from Terraform output${NC}"
    echo -e "${YELLOW}Make sure you've run 'terraform apply' with the bedrock module${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Bedrock Role ARN: ${BEDROCK_ROLE_ARN}${NC}"

# Check if namespace exists
if ! kubectl get namespace product-platform &>/dev/null; then
    echo -e "${YELLOW}Creating namespace product-platform...${NC}"
    kubectl create namespace product-platform
fi

# Check if service account exists
if kubectl get serviceaccount ai-service-sa -n product-platform &>/dev/null; then
    echo -e "${GREEN}Annotating existing service account...${NC}"
    kubectl annotate serviceaccount ai-service-sa \
        -n product-platform \
        eks.amazonaws.com/role-arn="${BEDROCK_ROLE_ARN}" \
        --overwrite
else
    echo -e "${YELLOW}Creating service account with annotation...${NC}"
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ai-service-sa
  namespace: product-platform
  annotations:
    eks.amazonaws.com/role-arn: ${BEDROCK_ROLE_ARN}
EOF
fi

# Restart ai-service pods to pick up new credentials
echo -e "${GREEN}🔄 Restarting ai-service pods...${NC}"
kubectl rollout restart deployment/ai-service -n product-platform 2>/dev/null || echo "Deployment not found, skipping restart"

echo ""
echo -e "${GREEN}✅ IRSA Configuration Complete!${NC}"
echo ""
echo "Service Account: ai-service-sa"
echo "Namespace: product-platform"
echo "IAM Role: ${BEDROCK_ROLE_ARN}"
echo ""
echo -e "${YELLOW}📝 Note: The ai-service pods will now have access to Amazon Bedrock${NC}"
