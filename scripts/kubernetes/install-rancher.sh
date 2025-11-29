#!/bin/bash

# ============================================
# 🐮 RANCHER INSTALLATION SCRIPT
# Product Comparison Platform
# ============================================

set -e

echo "============================================"
echo "🐮 RANCHER INSTALLATION SCRIPT"
echo "============================================"

# Colors for output
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
RANCHER_HOSTNAME="${RANCHER_HOSTNAME:-rancher.product-comparison.local}"
RANCHER_NAMESPACE="cattle-system"
CERT_MANAGER_VERSION="v1.13.3"
RANCHER_VERSION="2.9.2"
BOOTSTRAP_PASSWORD="${RANCHER_BOOTSTRAP_PASSWORD:-Admin123!}"

# ============================================
# 1. CHECK PREREQUISITES
# ============================================
echo ""
echo "📋 Checking prerequisites..."

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed"
    exit 1
fi
print_status "kubectl is installed"

# Check helm
if ! command -v helm &> /dev/null; then
    print_error "Helm is not installed. Run ./install-helm.sh first"
    exit 1
fi
print_status "Helm is installed"

# Check cluster connection
if ! kubectl cluster-info &> /dev/null; then
    print_error "Not connected to Kubernetes cluster"
    print_info "Run: aws eks update-kubeconfig --region us-east-1 --name product-comparison-dev"
    exit 1
fi
print_status "Connected to Kubernetes cluster"

CLUSTER_NAME=$(kubectl config current-context)
print_info "Current cluster: $CLUSTER_NAME"

# ============================================
# 2. INSTALL CERT-MANAGER
# ============================================
echo ""
echo "🔐 Installing cert-manager..."

# Check if cert-manager is already installed
if kubectl get namespace cert-manager &> /dev/null; then
    print_warning "cert-manager namespace already exists"
    read -p "Reinstall cert-manager? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping cert-manager installation"
    else
        kubectl delete namespace cert-manager --ignore-not-found
        sleep 5
    fi
fi

# Add jetstack repo
helm repo add jetstack https://charts.jetstack.io 2>/dev/null || true
helm repo update

# Install cert-manager CRDs
print_info "Installing cert-manager CRDs..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.crds.yaml

# Create namespace
kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

# Install cert-manager
print_info "Installing cert-manager ${CERT_MANAGER_VERSION}..."
helm upgrade --install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --version ${CERT_MANAGER_VERSION} \
    --set installCRDs=false \
    --wait

# Wait for cert-manager to be ready
print_info "Waiting for cert-manager to be ready..."
kubectl rollout status deployment/cert-manager -n cert-manager --timeout=120s
kubectl rollout status deployment/cert-manager-webhook -n cert-manager --timeout=120s
kubectl rollout status deployment/cert-manager-cainjector -n cert-manager --timeout=120s

print_status "cert-manager installed successfully"

# ============================================
# 3. INSTALL RANCHER
# ============================================
echo ""
echo "🐮 Installing Rancher..."

# Add rancher repo
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable 2>/dev/null || true
helm repo update

# Create namespace
kubectl create namespace ${RANCHER_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Install Rancher
print_info "Installing Rancher ${RANCHER_VERSION}..."
helm upgrade --install rancher rancher-stable/rancher \
    --namespace ${RANCHER_NAMESPACE} \
    --set hostname=${RANCHER_HOSTNAME} \
    --set bootstrapPassword=${BOOTSTRAP_PASSWORD} \
    --set replicas=1 \
    --set ingress.tls.source=rancher \
    --version ${RANCHER_VERSION} \
    --wait --timeout=10m

# Wait for Rancher to be ready
print_info "Waiting for Rancher deployment..."
kubectl rollout status deployment/rancher -n ${RANCHER_NAMESPACE} --timeout=300s

print_status "Rancher installed successfully"

# ============================================
# 4. EXPOSE RANCHER
# ============================================
echo ""
echo "🌐 Exposing Rancher..."

# Create LoadBalancer service for Rancher
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: rancher-lb
  namespace: ${RANCHER_NAMESPACE}
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
spec:
  type: LoadBalancer
  ports:
  - name: https
    port: 443
    targetPort: 443
    protocol: TCP
  selector:
    app: rancher
EOF

print_info "Waiting for LoadBalancer to be provisioned..."
sleep 30

# Get LoadBalancer URL
LB_HOSTNAME=""
for i in {1..20}; do
    LB_HOSTNAME=$(kubectl get svc rancher-lb -n ${RANCHER_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)
    if [[ -n "$LB_HOSTNAME" ]]; then
        break
    fi
    print_info "Waiting for LoadBalancer... (attempt $i/20)"
    sleep 15
done

# ============================================
# 5. GET ACCESS INFO
# ============================================
echo ""
echo "============================================"
echo "✅ RANCHER INSTALLATION COMPLETE!"
echo "============================================"
echo ""
echo "📋 Access Information:"
echo "   Hostname: ${RANCHER_HOSTNAME}"
echo "   Bootstrap Password: ${BOOTSTRAP_PASSWORD}"
echo ""

if [[ -n "$LB_HOSTNAME" ]]; then
    echo "🌐 LoadBalancer URL:"
    echo "   https://${LB_HOSTNAME}"
    echo ""
    echo "⚠️  Note: Accept the self-signed certificate warning in your browser"
else
    echo "⚠️  LoadBalancer still provisioning. Check with:"
    echo "   kubectl get svc rancher-lb -n ${RANCHER_NAMESPACE}"
fi

echo ""
echo "🔧 Port-Forward Access (Alternative):"
echo "   kubectl port-forward svc/rancher -n ${RANCHER_NAMESPACE} 8443:443"
echo "   Then access: https://localhost:8443"
echo ""
echo "📊 Check Rancher status:"
echo "   kubectl get pods -n ${RANCHER_NAMESPACE}"
echo "   kubectl get svc -n ${RANCHER_NAMESPACE}"
echo ""
echo "🔑 Get bootstrap password (if needed):"
echo "   kubectl get secret --namespace ${RANCHER_NAMESPACE} bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}'"
echo ""

# ============================================
# 6. SAVE ACCESS INFO
# ============================================
cat > /tmp/rancher-access.txt << EOF
============================================
RANCHER ACCESS INFORMATION
============================================

Hostname: ${RANCHER_HOSTNAME}
Bootstrap Password: ${BOOTSTRAP_PASSWORD}

LoadBalancer URL: https://${LB_HOSTNAME:-<pending>}

Port-Forward Command:
kubectl port-forward svc/rancher -n ${RANCHER_NAMESPACE} 8443:443

Then access: https://localhost:8443

============================================
EOF

print_info "Access info saved to /tmp/rancher-access.txt"