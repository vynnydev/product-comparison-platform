#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║  📊 STATUS - PRODUCT COMPARISON PLATFORM     ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Namespaces
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📁 NAMESPACES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl get namespaces | grep -E "(product-platform|monitoring|argocd|data|quality)"
echo ""

# Product Platform
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 PRODUCT-PLATFORM (Microservices)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl get pods,svc,hpa -n product-platform 2>/dev/null || echo "Namespace não encontrado"
echo ""

# Monitoring
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 MONITORING${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl get pods,svc -n monitoring 2>/dev/null || echo "Namespace não encontrado"
echo ""

# ArgoCD
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔄 ARGOCD${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl get pods,svc -n argocd 2>/dev/null | head -20 || echo "Namespace não encontrado"
echo ""

# Data
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💾 DATA${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
kubectl get pods,svc -n data 2>/dev/null || echo "Namespace não encontrado"
echo ""

# Resumo de pods
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📈 RESUMO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

RUNNING=$(kubectl get pods -A --no-headers 2>/dev/null | grep -c "Running" || echo "0")
PENDING=$(kubectl get pods -A --no-headers 2>/dev/null | grep -c "Pending" || echo "0")
ERROR=$(kubectl get pods -A --no-headers 2>/dev/null | grep -cE "(Error|CrashLoopBackOff)" || echo "0")

echo -e "  ${GREEN}✅ Running:${NC} $RUNNING"
echo -e "  ${YELLOW}⏳ Pending:${NC} $PENDING"
echo -e "  ${RED}❌ Error:${NC} $ERROR"
echo ""