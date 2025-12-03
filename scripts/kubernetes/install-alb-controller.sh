#!/bin/bash
# ============================================
# AWS LOAD BALANCER CONTROLLER - Installation Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# CONFIGURATION - ADJUST THESE VALUES
# ============================================
CLUSTER_NAME="${CLUSTER_NAME:-product-comparison-dev}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-347277718217}"
NAMESPACE="kube-system"
SERVICE_ACCOUNT_NAME="aws-load-balancer-controller"
POLICY_NAME="AWSLoadBalancerControllerIAMPolicy"

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}AWS Load Balancer Controller Installation${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Cluster: ${YELLOW}${CLUSTER_NAME}${NC}"
echo -e "Region: ${YELLOW}${AWS_REGION}${NC}"
echo -e "Account: ${YELLOW}${AWS_ACCOUNT_ID}${NC}"
echo ""

# ============================================
# STEP 1: Update kubeconfig
# ============================================
echo -e "${YELLOW}[1/6] Updating kubeconfig...${NC}"
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}
echo -e "${GREEN}✓ Kubeconfig updated${NC}"
echo ""

# ============================================
# STEP 2: Check if IAM Policy exists, create if not
# ============================================
echo -e "${YELLOW}[2/6] Checking IAM Policy...${NC}"

POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

if aws iam get-policy --policy-arn ${POLICY_ARN} 2>/dev/null; then
    echo -e "${GREEN}✓ IAM Policy already exists${NC}"
else
    echo -e "${YELLOW}Creating IAM Policy...${NC}"
    
    # Download the IAM policy
    curl -sS -o /tmp/iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
    
    # Create the policy
    aws iam create-policy \
        --policy-name ${POLICY_NAME} \
        --policy-document file:///tmp/iam-policy.json \
        --region ${AWS_REGION}
    
    echo -e "${GREEN}✓ IAM Policy created${NC}"
fi
echo ""

# ============================================
# STEP 3: Get OIDC Provider
# ============================================
echo -e "${YELLOW}[3/6] Getting OIDC Provider...${NC}"

OIDC_ID=$(aws eks describe-cluster --name ${CLUSTER_NAME} --region ${AWS_REGION} \
    --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)

echo -e "OIDC ID: ${YELLOW}${OIDC_ID}${NC}"

# Check if OIDC provider exists
if aws iam list-open-id-connect-providers | grep -q ${OIDC_ID}; then
    echo -e "${GREEN}✓ OIDC Provider already exists${NC}"
else
    echo -e "${YELLOW}Creating OIDC Provider...${NC}"
    eksctl utils associate-iam-oidc-provider \
        --cluster ${CLUSTER_NAME} \
        --region ${AWS_REGION} \
        --approve
    echo -e "${GREEN}✓ OIDC Provider created${NC}"
fi
echo ""

# ============================================
# STEP 4: Create IAM Service Account
# ============================================
echo -e "${YELLOW}[4/6] Creating IAM Service Account...${NC}"

# Check if service account exists
if kubectl get serviceaccount ${SERVICE_ACCOUNT_NAME} -n ${NAMESPACE} 2>/dev/null; then
    echo -e "${YELLOW}Service account exists, deleting to recreate...${NC}"
    kubectl delete serviceaccount ${SERVICE_ACCOUNT_NAME} -n ${NAMESPACE} || true
fi

eksctl create iamserviceaccount \
    --cluster=${CLUSTER_NAME} \
    --namespace=${NAMESPACE} \
    --name=${SERVICE_ACCOUNT_NAME} \
    --attach-policy-arn=${POLICY_ARN} \
    --region=${AWS_REGION} \
    --override-existing-serviceaccounts \
    --approve

echo -e "${GREEN}✓ IAM Service Account created${NC}"
echo ""

# ============================================
# STEP 5: Install Helm Chart
# ============================================
echo -e "${YELLOW}[5/6] Installing AWS Load Balancer Controller via Helm...${NC}"

# Add the EKS chart repo
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Check if already installed
if helm list -n ${NAMESPACE} | grep -q aws-load-balancer-controller; then
    echo -e "${YELLOW}ALB Controller already installed, upgrading...${NC}"
    HELM_CMD="upgrade"
else
    HELM_CMD="install"
fi

# Install/Upgrade the controller
helm ${HELM_CMD} aws-load-balancer-controller eks/aws-load-balancer-controller \
    -n ${NAMESPACE} \
    --set clusterName=${CLUSTER_NAME} \
    --set serviceAccount.create=false \
    --set serviceAccount.name=${SERVICE_ACCOUNT_NAME} \
    --set region=${AWS_REGION} \
    --set vpcId=$(aws eks describe-cluster --name ${CLUSTER_NAME} --region ${AWS_REGION} \
        --query "cluster.resourcesVpcConfig.vpcId" --output text) \
    --set enableShield=false \
    --set enableWaf=false \
    --set enableWafv2=false

echo -e "${GREEN}✓ AWS Load Balancer Controller installed${NC}"
echo ""

# ============================================
# STEP 6: Verify Installation
# ============================================
echo -e "${YELLOW}[6/6] Verifying installation...${NC}"

echo -e "${YELLOW}Waiting for controller pods to be ready...${NC}"
sleep 10

kubectl get deployment -n ${NAMESPACE} aws-load-balancer-controller

echo ""
kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=aws-load-balancer-controller

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Create an Ingress resource with the annotation:"
echo -e "   ${YELLOW}kubernetes.io/ingress.class: alb${NC}"
echo -e ""
echo -e "2. Or use IngressClass:"
echo -e "   ${YELLOW}ingressClassName: alb${NC}"
echo ""