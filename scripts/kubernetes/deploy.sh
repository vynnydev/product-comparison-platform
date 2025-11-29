#!/bin/bash

# ============================================
# 🚀 DEPLOY SCRIPT - Product Comparison Platform
# ============================================

set -e

echo "============================================"
echo "🚀 PRODUCT COMPARISON PLATFORM - DEPLOY"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ============================================
# CONFIGURATION
# ============================================
NAMESPACE="product-platform"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-347277718217}"
EKS_CLUSTER_NAME="${EKS_CLUSTER_NAME:-product-comparison-dev}"
ECR_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Directory paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="${SCRIPT_DIR}/../../k8s"
BACKEND_DIR="${SCRIPT_DIR}/../../backend"

# ============================================
# FUNCTIONS
# ============================================

check_prerequisites() {
    echo ""
    echo "📋 Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    print_status "kubectl installed"
    
    # Check aws cli
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    print_status "AWS CLI installed"
    
    # Check docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_status "Docker installed"
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        print_warning "Not connected to cluster. Connecting..."
        aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}
    fi
    print_status "Connected to EKS cluster: ${EKS_CLUSTER_NAME}"
}

login_ecr() {
    echo ""
    echo "🔐 Logging into ECR..."
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}
    print_status "ECR login successful"
}

build_and_push_images() {
    echo ""
    echo "🐳 Building and pushing Docker images..."
    
    # Build Product Service
    if [[ -d "${BACKEND_DIR}/product-service" ]]; then
        print_info "Building product-service..."
        docker build -t ${ECR_REPO}/product-comparison-dev-api:latest \
            -f ${BACKEND_DIR}/product-service/Dockerfile \
            ${BACKEND_DIR}/product-service
        
        print_info "Pushing product-service..."
        docker push ${ECR_REPO}/product-comparison-dev-api:latest
        print_status "product-service pushed"
    else
        print_warning "product-service directory not found, skipping..."
    fi
    
    # Build AI Service
    if [[ -d "${BACKEND_DIR}/ai-service" ]]; then
        print_info "Building ai-service..."
        docker build -t ${ECR_REPO}/product-comparison-dev-ai-service:latest \
            -f ${BACKEND_DIR}/ai-service/Dockerfile \
            ${BACKEND_DIR}/ai-service
        
        print_info "Pushing ai-service..."
        docker push ${ECR_REPO}/product-comparison-dev-ai-service:latest
        print_status "ai-service pushed"
    else
        print_warning "ai-service directory not found, skipping..."
    fi
}

deploy_infrastructure() {
    echo ""
    echo "🏗️  Deploying Kubernetes infrastructure..."
    
    # Create namespace and base resources
    kubectl apply -f ${K8S_DIR}/infrastructure/namespace.yaml
    print_status "Namespace created"
    
    # Apply ConfigMaps
    kubectl apply -f ${K8S_DIR}/infrastructure/configmaps.yaml
    print_status "ConfigMaps applied"
    
    # Apply Secrets (user should update these first!)
    print_warning "Applying Secrets - MAKE SURE TO UPDATE CREDENTIALS FIRST!"
    kubectl apply -f ${K8S_DIR}/infrastructure/secrets.yaml
    print_status "Secrets applied"
}

deploy_services() {
    echo ""
    echo "🚀 Deploying microservices..."
    
    # Deploy Product Service
    print_info "Deploying product-service..."
    kubectl apply -f ${K8S_DIR}/product-service/
    print_status "product-service deployed"
    
    # Deploy AI Service
    print_info "Deploying ai-service..."
    kubectl apply -f ${K8S_DIR}/ai-service/
    print_status "ai-service deployed"
}

deploy_ingress() {
    echo ""
    echo "🌐 Deploying Ingress..."
    kubectl apply -f ${K8S_DIR}/ingress/
    print_status "Ingress deployed"
}

wait_for_pods() {
    echo ""
    echo "⏳ Waiting for pods to be ready..."
    
    kubectl rollout status deployment/product-service -n ${NAMESPACE} --timeout=300s || true
    kubectl rollout status deployment/ai-service -n ${NAMESPACE} --timeout=300s || true
    
    print_status "Pods are ready"
}

show_status() {
    echo ""
    echo "============================================"
    echo "📊 DEPLOYMENT STATUS"
    echo "============================================"
    echo ""
    
    echo "📦 Pods:"
    kubectl get pods -n ${NAMESPACE} -o wide
    echo ""
    
    echo "🔌 Services:"
    kubectl get svc -n ${NAMESPACE}
    echo ""
    
    echo "🌐 Ingress:"
    kubectl get ingress -n ${NAMESPACE}
    echo ""
    
    # Get LoadBalancer URLs
    echo "🔗 LoadBalancer URLs:"
    PRODUCT_LB=$(kubectl get svc product-service-lb -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
    AI_LB=$(kubectl get svc ai-service-lb -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
    
    echo "   Product Service: http://${PRODUCT_LB}"
    echo "   AI Service: http://${AI_LB}"
}

# ============================================
# MAIN
# ============================================

case "${1:-all}" in
    check)
        check_prerequisites
        ;;
    build)
        check_prerequisites
        login_ecr
        build_and_push_images
        ;;
    deploy)
        check_prerequisites
        deploy_infrastructure
        deploy_services
        deploy_ingress
        wait_for_pods
        show_status
        ;;
    all)
        check_prerequisites
        login_ecr
        build_and_push_images
        deploy_infrastructure
        deploy_services
        deploy_ingress
        wait_for_pods
        show_status
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 {check|build|deploy|all|status}"
        echo ""
        echo "Commands:"
        echo "  check   - Check prerequisites"
        echo "  build   - Build and push Docker images"
        echo "  deploy  - Deploy to Kubernetes"
        echo "  all     - Run all steps (default)"
        echo "  status  - Show deployment status"
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo "✅ DEPLOY COMPLETE!"
echo "============================================"