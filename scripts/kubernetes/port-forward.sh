#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║  🔗 PORT FORWARD - QUICK ACCESS              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Selecione o serviço:${NC}"
echo ""
echo "  1) Product Service    (8080)"
echo "  2) AI Service         (8081)"
echo "  3) Search Service     (8082)"
echo "  4) Frontend           (3000)"
echo "  5) Grafana            (3000 → 3001)"
echo "  6) Prometheus         (9090)"
echo "  7) ArgoCD             (8080 → 8443)"
echo "  8) OpenSearch Proxy   (9200)"
echo "  9) Loki               (3100)"
echo "  0) Todos (background)"
echo ""
read -p "Opção: " option

case $option in
    1)
        echo -e "${GREEN}📦 Product Service: http://localhost:8080${NC}"
        kubectl port-forward svc/product-service 8080:8080 -n product-platform
        ;;
    2)
        echo -e "${GREEN}🤖 AI Service: http://localhost:8081${NC}"
        kubectl port-forward svc/ai-service 8081:8081 -n product-platform
        ;;
    3)
        echo -e "${GREEN}🔍 Search Service: http://localhost:8082${NC}"
        kubectl port-forward svc/search-service 8082:8082 -n product-platform
        ;;
    4)
        echo -e "${GREEN}🎨 Frontend: http://localhost:3000${NC}"
        kubectl port-forward svc/frontend 3000:3000 -n product-platform
        ;;
    5)
        echo -e "${GREEN}📊 Grafana: http://localhost:3001${NC}"
        echo -e "${YELLOW}   User: admin / Pass: admin123${NC}"
        kubectl port-forward svc/grafana 3001:3000 -n monitoring
        ;;
    6)
        echo -e "${GREEN}📈 Prometheus: http://localhost:9090${NC}"
        kubectl port-forward svc/prometheus 9090:9090 -n monitoring
        ;;
    7)
        echo -e "${GREEN}🔄 ArgoCD: https://localhost:8443${NC}"
        ARGO_PWD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" 2>/dev/null | base64 -d)
        echo -e "${YELLOW}   User: admin / Pass: $ARGO_PWD${NC}"
        kubectl port-forward svc/argocd-server 8443:443 -n argocd
        ;;
    8)
        echo -e "${GREEN}🔍 OpenSearch: http://localhost:9200/_dashboards${NC}"
        echo -e "${YELLOW}   User: admin / Pass: ProdCompPlat135246OpenSearch!${NC}"
        kubectl port-forward svc/opensearch-proxy 9200:80 -n data
        ;;
    9)
        echo -e "${GREEN}📝 Loki: http://localhost:3100${NC}"
        kubectl port-forward svc/loki 3100:3100 -n monitoring
        ;;
    0)
        echo -e "${YELLOW}🚀 Starting all port-forwards in background...${NC}"
        
        kubectl port-forward svc/product-service 8080:8080 -n product-platform &
        kubectl port-forward svc/ai-service 8081:8081 -n product-platform &
        kubectl port-forward svc/search-service 8082:8082 -n product-platform &
        kubectl port-forward svc/frontend 3000:3000 -n product-platform &
        kubectl port-forward svc/grafana 3001:3000 -n monitoring &
        kubectl port-forward svc/prometheus 9090:9090 -n monitoring &
        
        echo ""
        echo -e "${GREEN}✅ All port-forwards started!${NC}"
        echo ""
        echo "URLs:"
        echo "  - Product Service: http://localhost:8080"
        echo "  - AI Service:      http://localhost:8081"
        echo "  - Search Service:  http://localhost:8082"
        echo "  - Frontend:        http://localhost:3000"
        echo "  - Grafana:         http://localhost:3001"
        echo "  - Prometheus:      http://localhost:9090"
        echo ""
        echo "Para parar: pkill -f 'kubectl port-forward'"
        ;;
    *)
        echo "Opção inválida"
        exit 1
        ;;
esac