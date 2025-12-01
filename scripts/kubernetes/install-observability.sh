#!/bin/bash
# ============================================
# INSTALL OBSERVABILITY STACK
# Prometheus + Grafana + Loki + Promtail
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="../../k8s/monitoring/"

echo "============================================"
echo "  Installing Observability Stack"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
    print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

print_status "Connected to Kubernetes cluster"

# Create namespace
echo ""
echo "Creating monitoring namespace..."
kubectl apply -f "${K8S_DIR}/namespace.yaml"
print_status "Namespace created"

# Deploy Prometheus
echo ""
echo "Deploying Prometheus..."
kubectl apply -f "${K8S_DIR}/prometheus-rbac.yaml"
kubectl apply -f "${K8S_DIR}/prometheus-config.yaml"
kubectl apply -f "${K8S_DIR}/prometheus-deployment.yaml"
print_status "Prometheus deployed"

# Deploy Loki
echo ""
echo "Deploying Loki..."
kubectl apply -f "${K8S_DIR}/loki-deployment.yaml"
print_status "Loki deployed"

# Deploy Promtail
echo ""
echo "Deploying Promtail..."
kubectl apply -f "${K8S_DIR}/promtail-daemonset.yaml"
print_status "Promtail deployed"

# Deploy Grafana
echo ""
echo "Deploying Grafana..."
kubectl apply -f "${K8S_DIR}/grafana-config.yaml"
kubectl apply -f "${K8S_DIR}/grafana-dashboards.yaml"
kubectl apply -f "${K8S_DIR}/grafana-deployment.yaml"
print_status "Grafana deployed"

# Wait for deployments
echo ""
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/prometheus -n monitoring --timeout=120s
kubectl rollout status deployment/loki -n monitoring --timeout=120s
kubectl rollout status deployment/grafana -n monitoring --timeout=120s
kubectl rollout status daemonset/promtail -n monitoring --timeout=120s
print_status "All deployments ready"

# Get service URLs
echo ""
echo "============================================"
echo "  Observability Stack Installed!"
echo "============================================"

# Get LoadBalancer IPs
echo ""
echo "Getting service URLs..."
sleep 10

PROMETHEUS_URL=$(kubectl get svc prometheus-external -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
GRAFANA_URL=$(kubectl get svc grafana-external -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")

echo ""
echo "============================================"
echo "  Access URLs:"
echo "============================================"
echo ""
if [ "$PROMETHEUS_URL" != "pending" ] && [ -n "$PROMETHEUS_URL" ]; then
    echo "Prometheus: http://${PROMETHEUS_URL}:9090"
else
    echo "Prometheus: kubectl port-forward svc/prometheus 9090:9090 -n monitoring"
fi

if [ "$GRAFANA_URL" != "pending" ] && [ -n "$GRAFANA_URL" ]; then
    echo "Grafana:    http://${GRAFANA_URL}"
else
    echo "Grafana:    kubectl port-forward svc/grafana 3000:3000 -n monitoring"
fi

echo ""
echo "============================================"
echo "  Grafana Credentials:"
echo "============================================"
echo "Username: admin"
echo "Password: Admin123!"
echo ""
echo "============================================"
echo "  Pre-configured Dashboards:"
echo "============================================"
echo "1. Spring Boot Microservices"
echo "2. Kubernetes Cluster"
echo ""
print_warning "Note: LoadBalancer URLs may take a few minutes to be available"
echo ""