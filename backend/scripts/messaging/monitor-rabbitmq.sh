#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   🐰 RABBITMQ EVENT MONITOR - Real-time Event Viewer      ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Detect docker-compose command (V1 vs V2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
    echo -e "${CYAN}Using: docker-compose (V1)${NC}"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
    echo -e "${CYAN}Using: docker compose (V2)${NC}"
else
    echo -e "${RED}❌ Erro: docker-compose ou 'docker compose' não encontrado!${NC}"
    echo "Instale o Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo ""
echo -e "${YELLOW}Escolha o modo de monitoramento:${NC}"
echo "  1. Apenas eventos RabbitMQ (recomendado)"
echo "  2. Todos os logs (verbose)"
echo ""
read -p "Opção (1/2): " mode_choice

echo ""
echo -e "${BLUE}Monitoring RabbitMQ Events...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# Event counters
published_count=0
received_count=0
processed_count=0

if [[ $mode_choice == "2" ]]; then
    # MODE 2: Show all logs (verbose)
    echo -e "${CYAN}[MODE: ALL LOGS]${NC}"
    echo ""
    
    $DOCKER_COMPOSE logs -f --tail=0 product-service ai-service 2>&1 | while read line; do
        timestamp=$(date '+%H:%M:%S')
        
        # Color code by service
        if [[ $line == *"product-service"* ]]; then
            echo -e "${CYAN}[$timestamp]${NC} ${GREEN}[PRODUCT]${NC} $line"
        elif [[ $line == *"ai-service"* ]]; then
            echo -e "${CYAN}[$timestamp]${NC} ${BLUE}[AI]${NC} $line"
        else
            echo -e "${CYAN}[$timestamp]${NC} $line"
        fi
    done
else
    # MODE 1: Show only RabbitMQ events (default)
    echo -e "${CYAN}[MODE: EVENTS ONLY]${NC}"
    echo ""
    
    $DOCKER_COMPOSE logs -f --tail=50 product-service ai-service 2>&1 | while read line; do
        # Expanded filters to catch more event-related logs
        if [[ $line == *"Publishing"* ]] || \
           [[ $line == *"Published"* ]] || \
           [[ $line == *"Received event"* ]] || \
           [[ $line == *"Consuming"* ]] || \
           [[ $line == *"Processing"* ]] || \
           [[ $line == *"Processed"* ]] || \
           [[ $line == *"Analyzing"* ]] || \
           [[ $line == *"analysis complete"* ]] || \
           [[ $line == *"product.created"* ]] || \
           [[ $line == *"product.updated"* ]] || \
           [[ $line == *"product.deleted"* ]] || \
           [[ $line == *"PRODUCT_CREATED"* ]] || \
           [[ $line == *"PRODUCT_UPDATED"* ]] || \
           [[ $line == *"PRODUCT_DELETED"* ]] || \
           [[ $line == *"RabbitMQ"* ]] || \
           [[ $line == *"rabbitmq"* ]] || \
           [[ $line == *"Exchange"* ]] || \
           [[ $line == *"Queue"* ]] || \
           [[ $line == *"Routing"* ]]; then
            
            timestamp=$(date '+%H:%M:%S')
            
            # Color code by service and event type
            if [[ $line == *"product-service"* ]]; then
                if [[ $line == *"Publishing"* ]] || [[ $line == *"Published"* ]]; then
                    echo -e "${CYAN}[$timestamp]${NC} ${GREEN}📤 [PUBLISHER]${NC} $line"
                    ((published_count++))
                else
                    echo -e "${CYAN}[$timestamp]${NC} ${GREEN}[PRODUCT]${NC} $line"
                fi
            elif [[ $line == *"ai-service"* ]]; then
                if [[ $line == *"Received"* ]]; then
                    echo -e "${CYAN}[$timestamp]${NC} ${BLUE}📥 [CONSUMER]${NC} $line"
                    ((received_count++))
                elif [[ $line == *"Processed"* ]] || [[ $line == *"complete"* ]]; then
                    echo -e "${CYAN}[$timestamp]${NC} ${MAGENTA}✓ [PROCESSED]${NC} $line"
                    ((processed_count++))
                elif [[ $line == *"Analyzing"* ]] || [[ $line == *"Processing"* ]]; then
                    echo -e "${CYAN}[$timestamp]${NC} ${YELLOW}⚙️  [PROCESSING]${NC} $line"
                else
                    echo -e "${CYAN}[$timestamp]${NC} ${BLUE}[AI]${NC} $line"
                fi
            else
                echo -e "${CYAN}[$timestamp]${NC} $line"
            fi
            
            # Show statistics every 10 events
            total_events=$((published_count + received_count + processed_count))
            if [ $((total_events % 10)) -eq 0 ] && [ $total_events -gt 0 ]; then
                echo ""
                echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
                echo -e "${CYAN}📊 STATISTICS: Published: $published_count | Received: $received_count | Processed: $processed_count${NC}"
                echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
                echo ""
            fi
        fi
    done
fi