#!/bin/bash

set -e

# ============================================
# Colors
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================
# Configuration
# ============================================
PROJECT_NAME="product-comparison"
ENVIRONMENT="dev"
AWS_REGION="us-east-1"

# ============================================
# Functions
# ============================================

print_header() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                               ║${NC}"
    echo -e "${CYAN}║          🚀 PRODUCT COMPARISON PLATFORM - DEPLOY             ║${NC}"
    echo -e "${CYAN}║                  Infrastructure Provisioning                  ║${NC}"
    echo -e "${CYAN}║                                                               ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        exit 1
    fi
    print_success "$1 is installed"
}

# ============================================
# Pre-flight Checks
# ============================================

preflight_checks() {
    print_step "🔍 PRE-FLIGHT CHECKS"
    
    # Check required commands
    echo "Checking required tools..."
    check_command "terraform"
    check_command "aws"
    check_command "kubectl"
    check_command "jq"
    
    # Check Terraform version
    TF_VERSION=$(terraform version -json | jq -r '.terraform_version')
    echo ""
    print_success "Terraform version: $TF_VERSION"
    
    # Check AWS credentials
    echo ""
    echo "Checking AWS credentials..."
    if aws sts get-caller-identity &> /dev/null; then
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
        print_success "AWS Account: $AWS_ACCOUNT"
        print_success "AWS User: $AWS_USER"
    else
        print_error "AWS credentials not configured"
        echo ""
        echo "Run: aws configure"
        exit 1
    fi
    
    # Check if in correct directory
    if [ ! -f "main.tf" ]; then
        print_error "main.tf not found. Are you in the terraform/ directory?"
        exit 1
    fi
    print_success "Working directory is correct"
    
    # Check if modules exist
    echo ""
    echo "Checking modules..."
    for module in vpc ecr iam eks; do
        if [ ! -d "modules/$module" ]; then
            print_error "Module $module not found"
            exit 1
        fi
        print_success "Module $module exists"
    done
}

# ============================================
# Backend Setup
# ============================================

setup_backend() {
    print_step "🗄️  BACKEND SETUP"
    
    # Check if backend already exists
    BUCKET_NAME="${PROJECT_NAME}-${ENVIRONMENT}-terraform-state"
    
    if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
        echo "Backend S3 bucket does not exist. Creating..."
        echo ""
        
        read -p "Do you want to create the backend now? (yes/no): " CREATE_BACKEND
        
        if [ "$CREATE_BACKEND" == "yes" ]; then
            cd ../../infraestructure/terraform/modules/bootstrap
            terraform init
            terraform plan -out tfplan
            terraform apply tfplan
            cd ..
            print_success "Backend created successfully"
        else
            print_error "Backend is required. Exiting..."
            exit 1
        fi
    else
        print_success "Backend S3 bucket already exists: $BUCKET_NAME"
    fi
    
    # Check if backend.tf is commented
    if grep -q "^# terraform {" backend.tf; then
        print_warning "backend.tf is commented. Uncommenting..."
        
        # Uncomment backend.tf
        sed -i.bak 's/^# //g' backend.tf
        rm -f backend.tf.bak
        
        print_success "backend.tf uncommented"
    fi
}

# ============================================
# Terraform Init
# ============================================

terraform_init() {
    print_step "📦 TERRAFORM INIT"
    
    echo "Initializing Terraform..."
    if terraform init -upgrade; then
        print_success "Terraform initialized"
    else
        print_error "Terraform init failed"
        exit 1
    fi
}

# ============================================
# Terraform Plan
# ============================================

terraform_plan() {
    print_step "📋 TERRAFORM PLAN"
    
    echo "Creating execution plan..."
    if terraform plan -out=tfplan; then
        print_success "Plan created successfully"
        echo ""
        echo -e "${YELLOW}Plan saved to: tfplan${NC}"
    else
        print_error "Terraform plan failed"
        exit 1
    fi
}

# ============================================
# Terraform Apply
# ============================================

terraform_apply() {
    print_step "🚀 TERRAFORM APPLY"
    
    echo ""
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║                                                               ║${NC}"
    echo -e "${YELLOW}║  ⚠️  YOU ARE ABOUT TO CREATE AWS RESOURCES                    ║${NC}"
    echo -e "${YELLOW}║                                                               ║${NC}"
    echo -e "${YELLOW}║  Estimated time: ~20 minutes                                  ║${NC}"
    echo -e "${YELLOW}║  Estimated cost: ~\$150/month                                  ║${NC}"
    echo -e "${YELLOW}║                                                               ║${NC}"
    echo -e "${YELLOW}║  Resources to be created:                                     ║${NC}"
    echo -e "${YELLOW}║    • VPC with public/private subnets                          ║${NC}"
    echo -e "${YELLOW}║    • NAT Gateway                                              ║${NC}"
    echo -e "${YELLOW}║    • EKS Cluster (Control Plane)                              ║${NC}"
    echo -e "${YELLOW}║    • EKS Node Group (2x t3.medium)                            ║${NC}"
    echo -e "${YELLOW}║    • ECR Repository                                           ║${NC}"
    echo -e "${YELLOW}║    • IAM Roles and Policies                                   ║${NC}"
    echo -e "${YELLOW}║                                                               ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    read -p "Type 'yes' to proceed: " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        print_warning "Deployment cancelled by user"
        exit 0
    fi
    
    echo ""
    echo "Applying infrastructure changes..."
    echo ""
    
    START_TIME=$(date +%s)
    
    if terraform apply tfplan; then
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))
        MINUTES=$((DURATION / 60))
        SECONDS=$((DURATION % 60))
        
        echo ""
        print_success "Infrastructure deployed successfully!"
        print_success "Time taken: ${MINUTES}m ${SECONDS}s"
    else
        print_error "Terraform apply failed"
        exit 1
    fi
}

# ============================================
# Configure kubectl
# ============================================

configure_kubectl() {
    print_step "⚙️  CONFIGURE KUBECTL"
    
    echo "Configuring kubectl to access EKS cluster..."
    
    CLUSTER_NAME=$(terraform output -raw eks_cluster_name 2>/dev/null || echo "")
    
    if [ -z "$CLUSTER_NAME" ]; then
        print_error "Could not get cluster name from terraform outputs"
        return 1
    fi
    
    if aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME; then
        print_success "kubectl configured for cluster: $CLUSTER_NAME"
        
        echo ""
        echo "Testing cluster access..."
        if kubectl get nodes; then
            print_success "Cluster is accessible"
        else
            print_warning "Could not access cluster nodes. They may still be initializing..."
        fi
    else
        print_error "Failed to configure kubectl"
        return 1
    fi
}

# ============================================
# Display Outputs
# ============================================

display_outputs() {
    print_step "📊 DEPLOYMENT SUMMARY"
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║                  ✅ DEPLOYMENT SUCCESSFUL!                     ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Get outputs
    VPC_ID=$(terraform output -raw vpc_id 2>/dev/null || echo "N/A")
    ECR_URL=$(terraform output -raw ecr_repository_url 2>/dev/null || echo "N/A")
    CLUSTER_NAME=$(terraform output -raw eks_cluster_name 2>/dev/null || echo "N/A")
    CLUSTER_ENDPOINT=$(terraform output -raw eks_cluster_endpoint 2>/dev/null || echo "N/A")
    
    echo -e "${CYAN}📦 Resources Created:${NC}"
    echo ""
    echo "  VPC ID:           $VPC_ID"
    echo "  ECR Repository:   $ECR_URL"
    echo "  EKS Cluster:      $CLUSTER_NAME"
    echo "  Cluster Endpoint: $CLUSTER_ENDPOINT"
    echo ""
    
    # Save outputs to file
    OUTPUT_FILE="deployment-info.txt"
    cat > $OUTPUT_FILE <<EOF
# Product Comparison Platform - Deployment Information
# Generated: $(date)

VPC_ID=$VPC_ID
ECR_REPOSITORY_URL=$ECR_URL
EKS_CLUSTER_NAME=$CLUSTER_NAME
EKS_CLUSTER_ENDPOINT=$CLUSTER_ENDPOINT
AWS_REGION=$AWS_REGION
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Quick Commands:
# kubectl get nodes
# kubectl get pods -A
# aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL
EOF
    
    print_success "Deployment info saved to: $OUTPUT_FILE"
}

# ============================================
# Next Steps
# ============================================

show_next_steps() {
    print_step "📝 NEXT STEPS"
    
    echo ""
    echo -e "${PURPLE}1️⃣  Verify cluster nodes:${NC}"
    echo "   kubectl get nodes"
    echo ""
    
    echo -e "${PURPLE}2️⃣  Build and push Docker image:${NC}"
    echo "   cd ../backend"
    echo "   docker build -t product-api:v1.0 ."
    echo "   # Login to ECR and push (see deployment-info.txt)"
    echo ""
    
    echo -e "${PURPLE}3️⃣  Deploy application to Kubernetes:${NC}"
    echo "   kubectl apply -f k8s/"
    echo ""
    
    echo -e "${PURPLE}4️⃣  Check application status:${NC}"
    echo "   kubectl get pods"
    echo "   kubectl get svc"
    echo ""
    
    echo -e "${PURPLE}5️⃣  Get application URL:${NC}"
    echo "   kubectl get svc product-api-service"
    echo ""
    
    echo -e "${CYAN}📚 Documentation:${NC}"
    echo "   terraform output -json > outputs.json"
    echo "   ./scripts/show-outputs.sh"
    echo ""
}

# ============================================
# Main Execution
# ============================================

main() {
    print_header

    cd ../../infraestructure/terraform
    # Run deployment steps
    preflight_checks
    setup_backend
    terraform_init
    terraform_plan
    terraform_apply
    configure_kubectl
    display_outputs
    show_next_steps
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║              🎉 ALL DONE! INFRASTRUCTURE IS READY! 🎉         ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Run main function
main