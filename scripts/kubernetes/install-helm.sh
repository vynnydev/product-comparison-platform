#!/bin/bash

# ============================================
# 🎯 HELM INSTALLATION SCRIPT
# Product Comparison Platform
# ============================================

set -e

echo "============================================"
echo "🎯 HELM INSTALLATION SCRIPT"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ============================================
# 1. CHECK PREREQUISITES
# ============================================
echo ""
echo "📋 Checking prerequisites..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first."
    exit 1
fi
print_status "kubectl is installed"

# Check if connected to cluster
if ! kubectl cluster-info &> /dev/null; then
    print_warning "Not connected to a Kubernetes cluster"
    print_info "Run: aws eks update-kubeconfig --region us-east-1 --name product-comparison-dev"
    exit 1
fi
print_status "Connected to Kubernetes cluster"

# ============================================
# 2. INSTALL HELM
# ============================================
echo ""
echo "🔧 Installing Helm..."

# Check if Helm is already installed
if command -v helm &> /dev/null; then
    CURRENT_VERSION=$(helm version --short 2>/dev/null | cut -d'+' -f1)
    print_warning "Helm is already installed: $CURRENT_VERSION"
    read -p "Do you want to reinstall/upgrade? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping Helm installation"
    fi
fi

# Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64) ARCH="amd64" ;;
    aarch64|arm64) ARCH="arm64" ;;
esac

print_info "Detected OS: $OS, Architecture: $ARCH"

# Install Helm based on OS
case $OS in
    linux)
        print_info "Installing Helm for Linux..."
        curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        ;;
    darwin)
        print_info "Installing Helm for macOS..."
        if command -v brew &> /dev/null; then
            brew install helm
        else
            curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        fi
        ;;
    *)
        print_error "Unsupported OS: $OS"
        exit 1
        ;;
esac

# Verify installation
if command -v helm &> /dev/null; then
    HELM_VERSION=$(helm version --short)
    print_status "Helm installed successfully: $HELM_VERSION"
else
    print_error "Helm installation failed"
    exit 1
fi

# ============================================
# 3. ADD HELM REPOSITORIES
# ============================================
echo ""
echo "📦 Adding Helm repositories..."

# Add common repositories
helm repo add stable https://charts.helm.sh/stable 2>/dev/null || true
helm repo add bitnami https://charts.bitnami.com/bitnami 2>/dev/null || true
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx 2>/dev/null || true
helm repo add jetstack https://charts.jetstack.io 2>/dev/null || true
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/ 2>/dev/null || true
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable 2>/dev/null || true

# Update repositories
helm repo update

print_status "Helm repositories added and updated"

# ============================================
# 4. VERIFY HELM SETUP
# ============================================
echo ""
echo "🔍 Verifying Helm setup..."

helm repo list
echo ""
helm version

# ============================================
# SUMMARY
# ============================================
echo ""
echo "============================================"
echo "✅ HELM INSTALLATION COMPLETE!"
echo "============================================"
echo ""
echo "📋 Next steps:"
echo "   1. Run: ./install-rancher.sh"
echo "   2. Or install NGINX Ingress: helm install nginx ingress-nginx/ingress-nginx"
echo ""
echo "🔧 Useful commands:"
echo "   helm list -A                    # List all releases"
echo "   helm search repo <name>         # Search for charts"
echo "   helm install <name> <chart>     # Install a chart"
echo "   helm upgrade <name> <chart>     # Upgrade a release"
echo "   helm uninstall <name>           # Uninstall a release"
echo ""