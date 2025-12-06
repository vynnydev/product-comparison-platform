#!/bin/bash
set -e

echo "📊 Deploying Monitoring Stack..."
echo "================================"

kubectl apply -k monitoring/

echo ""
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=120s
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=120s
kubectl wait --for=condition=ready pod -l app=loki -n monitoring --timeout=120s

echo ""
echo "✅ Monitoring Stack deployed!"
echo ""
echo "📋 Access URLs:"
echo "  Prometheus: kubectl port-forward svc/prometheus 9090:9090 -n monitoring"
echo "  Grafana:    kubectl port-forward svc/grafana 3000:3000 -n monitoring"
echo "  Loki:       kubectl port-forward svc/loki 3100:3100 -n monitoring"
echo ""
echo "🔐 Grafana credentials: admin / admin123"