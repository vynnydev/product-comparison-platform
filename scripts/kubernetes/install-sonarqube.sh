#!/bin/bash
# ============================================
# INSTALL SONARQUBE
# Code Quality & Security Analysis
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="${SCRIPT_DIR}/../k8s/sonarqube"

echo "============================================"
echo "  Installing SonarQube"
echo "============================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install kubectl first."
    exit 1
fi

# Check cluster connection
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster."
    exit 1
fi

print_status "Connected to Kubernetes cluster"

# Deploy SonarQube
echo ""
echo "Deploying SonarQube..."
kubectl apply -f "${K8S_DIR}/sonarqube-deployment.yaml"
print_status "SonarQube deployment created"

# Wait for database
echo ""
echo "Waiting for PostgreSQL database..."
kubectl rollout status deployment/sonarqube-db -n sonarqube --timeout=180s
print_status "PostgreSQL is ready"

# Wait for SonarQube
echo ""
echo "Waiting for SonarQube (this may take 2-3 minutes)..."
kubectl rollout status deployment/sonarqube -n sonarqube --timeout=300s
print_status "SonarQube is ready"

# Get URL
echo ""
echo "Getting SonarQube URL..."
sleep 10

SONARQUBE_URL=$(kubectl get svc sonarqube-external -n sonarqube -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")

echo ""
echo "============================================"
echo "  SonarQube Installed!"
echo "============================================"
echo ""
if [ "$SONARQUBE_URL" != "pending" ] && [ -n "$SONARQUBE_URL" ]; then
    echo "URL: http://${SONARQUBE_URL}"
else
    echo "URL: kubectl port-forward svc/sonarqube 9000:9000 -n sonarqube"
fi
echo ""
echo "============================================"
echo "  Default Credentials:"
echo "============================================"
echo "Username: admin"
echo "Password: admin"
echo ""
print_warning "Change the default password on first login!"
echo ""
echo "============================================"
echo "  Configure GitHub Actions:"
echo "============================================"
echo "1. Login to SonarQube"
echo "2. Go to: Administration → Security → Users"
echo "3. Generate a token for 'admin' user"
echo "4. Add GitHub secrets:"
echo "   - SONAR_TOKEN: <generated-token>"
echo "   - SONAR_HOST_URL: http://${SONARQUBE_URL}"
echo ""