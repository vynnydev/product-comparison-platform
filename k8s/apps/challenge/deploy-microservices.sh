#!/bin/bash

# ============================================
# DEPLOY COGNITIVA ANALYTICS MICROSERVICES
# ============================================

set -e

echo "🚀 Deploying Cognitiva Analytics Microservices..."

# Verificar conexão com o cluster
echo "📡 Verificando conexão com o cluster..."
kubectl cluster-info

# Deploy usando Kustomize
echo "📦 Aplicando manifests..."
kubectl apply -k .

# Aguardar pods ficarem ready
echo "⏳ Aguardando pods ficarem ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/part-of=challenge -n cognitiva-analytics --timeout=120s

# Mostrar status
echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📊 Status dos Pods:"
kubectl get pods -n cognitiva-analytics -o wide

echo ""
echo "🔗 Services:"
kubectl get svc -n cognitiva-analytics

echo ""
echo "📈 Deployments:"
kubectl get deployments -n cognitiva-analytics

echo ""
echo "🎉 Todos os microserviços estão rodando!"
echo ""
echo "Microserviços deployados:"
echo "  ✅ identity-service     (Auth, Users, Employees, Team)"
echo "  ✅ asset-service        (Machines, Locations)"
echo "  ✅ operations-service   (Tasks, Reports, Dashboard, WebSocket)"
echo "  ✅ supply-chain-service (Inventory, Vendors)"
echo "  ✅ platform-service     (AI/Bedrock, Notifications, Settings)"