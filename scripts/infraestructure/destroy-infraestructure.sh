#!/bin/bash

set -e

# ============================================
# Colors
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================
# Configuration
# ============================================
PROJECT_NAME="product-comparison"
ENVIRONMENT="dev"

# ============================================
# Functions
# ============================================

print_header() {
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║        ⚠️  INFRASTRUCTURE DESTRUCTION SCRIPT ⚠️                ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
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
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ============================================
# Change to Terraform Directory
# ============================================

change_to_terraform_dir() {
    print_step "📂 NAVIGATING TO TERRAFORM DIRECTORY"
    
    # Get script directory
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    echo "Current location: $SCRIPT_DIR"
    
    # Navigate to terraform root (two levels up from scripts/infrastructure/)
    cd "$SCRIPT_DIR/../../infraestructure/terraform"
    
    TERRAFORM_DIR=$(pwd)
    echo "Terraform directory: $TERRAFORM_DIR"
    
    # Verify we're in the right place
    if [ ! -f "main.tf" ]; then
        print_error "main.tf not found. Wrong directory!"
        echo "Expected to be in: infrastructure/terraform/"
        exit 1
    fi
    
    print_success "In correct terraform directory"
}

# ============================================
# Pre-destruction Checks
# ============================================

pre_destruction_checks() {
    print_step "🔍 PRE-DESTRUCTION CHECKS"
    
    # Check if terraform is initialized
    if [ ! -d ".terraform" ]; then
        print_warning "Terraform not initialized. Running init..."
        terraform init
    fi
    
    # Check current state
    echo "Checking current infrastructure state..."
    RESOURCE_COUNT=$(terraform state list 2>/dev/null | wc -l || echo "0")
    
    if [ "$RESOURCE_COUNT" -eq 0 ]; then
        print_warning "No resources found in state. Nothing to destroy."
        exit 0
    fi
    
    print_success "Found $RESOURCE_COUNT resources in state"
    
    # List resources
    echo ""
    echo -e "${CYAN}Resources to be destroyed:${NC}"
    terraform state list | head -20
    
    if [ "$RESOURCE_COUNT" -gt 20 ]; then
        echo "... and $((RESOURCE_COUNT - 20)) more"
    fi
}

# ============================================
# Kubernetes Cleanup
# ============================================

kubernetes_cleanup() {
    print_step "☸️  KUBERNETES CLEANUP"
    
    # Get cluster name
    CLUSTER_NAME=$(terraform output -raw eks_cluster_name 2>/dev/null || echo "")
    
    if [ -z "$CLUSTER_NAME" ]; then
        print_warning "Could not get cluster name. Skipping k8s cleanup."
        return 0
    fi
    
    echo "Checking for LoadBalancers and other resources..."
    
    # Check if kubectl is configured
    if kubectl get nodes &>/dev/null; then
        echo ""
        print_warning "Deleting all LoadBalancer services (to release AWS ELBs)..."
        kubectl delete svc --all-namespaces --field-selector spec.type=LoadBalancer --ignore-not-found=true
        
        echo ""
        print_warning "Waiting 30 seconds for LoadBalancers to be released..."
        sleep 30
        
        print_success "Kubernetes cleanup completed"
    else
        print_warning "kubectl not configured or cluster not accessible. Skipping k8s cleanup."
    fi
}

# ============================================
# Show Destruction Warning
# ============================================

show_warning() {
    print_step "⚠️  FINAL WARNING"
    
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║           🚨 THIS WILL PERMANENTLY DELETE 🚨                  ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║  ALL AWS Infrastructure including:                            ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║    💰 EKS Cluster (~\$73/month)                                ║${NC}"
    echo -e "${RED}║    💻 EC2 Instances (Node Groups)                             ║${NC}"
    echo -e "${RED}║    🌐 VPC, Subnets, Internet Gateway                          ║${NC}"
    echo -e "${RED}║    🔀 NAT Gateway (~\$32/month)                                ║${NC}"
    echo -e "${RED}║    🐳 ECR Repository (and ALL images)                         ║${NC}"
    echo -e "${RED}║    🔐 IAM Roles and Policies                                  ║${NC}"
    echo -e "${RED}║    📦 All associated resources                                ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║  ⚠️  THIS ACTION CANNOT BE UNDONE! ⚠️                          ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}║  The S3 backend and DynamoDB table will NOT be deleted       ║${NC}"
    echo -e "${RED}║  (run destroy-backend.sh separately if needed)               ║${NC}"
    echo -e "${RED}║                                                               ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ============================================
# Create Destroy Plan
# ============================================

create_destroy_plan() {
    print_step "📋 CREATING DESTRUCTION PLAN"
    
    echo "Generating destroy plan..."
    echo ""
    
    if terraform plan -destroy -out=tfplan; then
        print_success "Destroy plan created successfully"
        echo ""
        echo -e "${YELLOW}Destroy plan saved to: tfplan${NC}"
    else
        print_error "Failed to create destroy plan"
        exit 1
    fi
}

# ============================================
# Confirm Destruction
# ============================================

confirm_destruction() {
    print_step "🔐 CONFIRMATION REQUIRED"
    
    echo ""
    read -p "Type 'destroy' to confirm destruction: " CONFIRM1
    
    if [ "$CONFIRM1" != "destroy" ]; then
        print_warning "Destruction cancelled by user"
        echo ""
        echo "Cleaning up tfplan file..."
        rm -f tfplan
        exit 0
    fi
    
    echo ""
    echo -e "${RED}Are you ABSOLUTELY SURE?${NC}"
    read -p "Type 'yes' to proceed: " CONFIRM2
    
    if [ "$CONFIRM2" != "yes" ]; then
        print_warning "Destruction cancelled by user"
        echo ""
        echo "Cleaning up tfplan file..."
        rm -f tfplan
        exit 0
    fi
    
    echo ""
    echo -e "${RED}FINAL CONFIRMATION${NC}"
    read -p "Type 'I understand this cannot be undone': " CONFIRM3
    
    if [ "$CONFIRM3" != "I understand this cannot be undone" ]; then
        print_warning "Destruction cancelled by user"
        echo ""
        echo "Cleaning up tfplan file..."
        rm -f tfplan
        exit 0
    fi
}

# ============================================
# Apply Destruction
# ============================================

apply_destruction() {
    print_step "💥 APPLYING DESTRUCTION"
    
    echo ""
    echo -e "${RED}🗑️  Destroying infrastructure...${NC}"
    echo ""
    
    START_TIME=$(date +%s)
    
    if terraform apply tfplan; then
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))
        MINUTES=$((DURATION / 60))
        SECONDS=$((DURATION % 60))
        
        echo ""
        print_success "Infrastructure destroyed successfully"
        print_success "Time taken: ${MINUTES}m ${SECONDS}s"
        
        # Clean up tfplan
        rm -f tfplan
    else
        print_error "Destruction failed"
        echo ""
        echo "The tfplan file has been preserved for investigation."
        echo "Check the errors above and resolve them before trying again."
        exit 1
    fi
}

# ============================================
# Cleanup State (Optional)
# ============================================

cleanup_state() {
    print_step "🧹 POST-DESTRUCTION CLEANUP"
    
    echo ""
    read -p "Do you want to remove the local state files? (yes/no): " CLEANUP
    
    if [ "$CLEANUP" == "yes" ]; then
        echo "Cleaning up local terraform files..."
        rm -rf .terraform
        rm -f .terraform.lock.hcl
        rm -f terraform.tfstate*
        rm -f tfplan
        
        print_success "Local terraform files cleaned up"
        print_warning "Backend state in S3 is preserved"
        print_warning "Run 'destroy-backend.sh' to remove S3 bucket and DynamoDB table"
    else
        print_success "Local state files preserved"
    fi
}

# ============================================
# Final Summary
# ============================================

final_summary() {
    print_step "📊 DESTRUCTION SUMMARY"
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║              ✅ INFRASTRUCTURE DESTROYED                       ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${CYAN}What was destroyed:${NC}"
    echo "  ✓ EKS Cluster and Node Groups"
    echo "  ✓ VPC and all networking components"
    echo "  ✓ NAT Gateway"
    echo "  ✓ ECR Repository"
    echo "  ✓ IAM Roles and Policies"
    echo "  ✓ All associated resources"
    echo ""
    
    echo -e "${YELLOW}What remains:${NC}"
    echo "  • S3 bucket: ${PROJECT_NAME}-${ENVIRONMENT}-terraform-state"
    echo "  • DynamoDB table: ${PROJECT_NAME}-${ENVIRONMENT}-terraform-locks"
    echo ""
    
    echo -e "${CYAN}To destroy backend:${NC}"
    echo "  ./scripts/infrastructure/destroy-backend.sh"
    echo ""
    
    echo -e "${CYAN}To recreate infrastructure:${NC}"
    echo "  ./scripts/infrastructure/deploy-infrastructure.sh"
    echo ""
}

# ============================================
# Main Execution
# ============================================

main() {
    print_header
    
    # Execute destruction steps
    change_to_terraform_dir
    pre_destruction_checks
    show_warning
    create_destroy_plan
    confirm_destruction
    # kubernetes_cleanup
    apply_destruction
    cleanup_state
    final_summary
    
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}║                  🎉 DESTRUCTION COMPLETE 🎉                   ║${NC}"
    echo -e "${GREEN}║                                                               ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Run main function
main