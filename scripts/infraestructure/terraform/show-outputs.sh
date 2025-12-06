#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║          🚀 TERRAFORM OUTPUTS - QUICK REFERENCE              ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Ir para diretório da terraform
cd ../../infraestructure/terraform

# Cluster Info
echo "☸️  EKS CLUSTER:"
terraform output -raw eks_cluster_name
echo ""
terraform output -raw eks_cluster_endpoint
echo ""
echo ""

# ECR Info
echo "🐳 ECR REPOSITORY:"
terraform output -raw ecr_repository_url
echo ""
echo ""

# Quick Commands
echo "⚡ COMANDOS RÁPIDOS:"
echo ""
echo "1. Configure kubectl:"
terraform output -raw step_1_configure_kubectl
echo ""
echo ""

echo "2. Login ECR:"
terraform output -raw step_3_ecr_login
echo ""
echo ""

echo "3. Verificar nodes:"
terraform output -raw step_2_verify_nodes
echo ""
echo ""

# Infrastructure Summary
echo "📊 RESUMO:"
terraform output -json infrastructure_summary | jq -r 'to_entries[] | "\(.key): \(.value)"'
echo ""

# Next Steps
echo ""
terraform output -raw next_steps