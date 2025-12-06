#!/bin/bash
set -e

echo "🔄 Deploying ArgoCD..."
echo "======================"

# Install ArgoCD
kubectl apply -k argocd/

echo ""
echo "⏳ Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=180s

echo ""
echo "✅ ArgoCD deployed!"
echo ""

# Get initial admin password
echo "🔐 Getting initial admin password..."
ARGO_PWD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo ""
echo "📋 Access:"
echo "  URL:      kubectl port-forward svc/argocd-server 8080:443 -n argocd"
echo "  User:     admin"
echo "  Password: $ARGO_PWD"
echo ""
echo "🌐 Open: https://localhost:8080"