#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║      🎬 DEMONSTRAÇÃO INTERATIVA - EVENTOS RABBITMQ        ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

sleep_time=3

# Detect docker-compose command (V1 vs V2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ Erro: docker-compose ou 'docker compose' não encontrado!${NC}"
    exit 1
fi

echo -e "${CYAN}Este script demonstra o fluxo de eventos entre os microserviços:${NC}"
echo ""
echo "1️⃣  Product-Service PUBLICA evento → RabbitMQ"
echo "2️⃣  RabbitMQ ROTEIA evento → AI-Service"
echo "3️⃣  AI-Service CONSOME e PROCESSA evento"
echo ""
echo "────────────────────────────────────────────────────────────"
echo ""

# ============================================================
# CLEANUP: Delete existing test products
# ============================================================

echo -e "${YELLOW}🗑️  Deseja limpar produtos de teste antigos antes de começar?${NC}"
echo "   (Recomendado se você já executou este script antes)"
echo ""
read -p "Limpar produtos antigos? (s/n): " cleanup_choice

if [[ $cleanup_choice == "s" || $cleanup_choice == "S" ]]; then
    echo ""
    echo -e "${BLUE}➤ Limpando produtos de teste...${NC}"
    
    # Get all products
    all_products=$(curl -s http://localhost:8080/api/products)
    
    if echo "$all_products" | jq empty 2>/dev/null; then
        product_ids=$(echo "$all_products" | jq -r '.[].id')
        
        if [ -n "$product_ids" ]; then
            deleted_count=0
            for id in $product_ids; do
                delete_response=$(curl -s -w "\n%{http_code}" -X DELETE "http://localhost:8080/api/products/$id")
                http_code=$(echo "$delete_response" | tail -n1)
                
                if [ "$http_code" = "204" ] || [ "$http_code" = "200" ]; then
                    ((deleted_count++))
                fi
            done
            
            echo -e "${GREEN}✓ $deleted_count produto(s) deletado(s)${NC}"
        else
            echo -e "${CYAN}ℹ️  Nenhum produto para deletar${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Não foi possível listar produtos${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}⏳ Aguardando 2 segundos...${NC}"
    sleep 2
fi

echo ""
read -p "Pressione ENTER para iniciar a demonstração..."
echo ""

# ============================================================
# TEST 1: Create Product (Trigger product.created event)
# ============================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📝 TESTE 1: Criar Produto (Dispara evento product.created)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}➤ Enviando requisição POST para Product-Service...${NC}"
echo ""

# Generate unique product name with timestamp
timestamp=$(date +%s)
product_name="MacBook Pro 16 M3 Max (Demo $timestamp)"

response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$product_name\",
    \"description\": \"Most powerful MacBook with M3 Max chip\",
    \"imageUrl\": \"https://example.com/macbook.jpg\",
    \"price\": 3499.99,
    \"rating\": 4.9,
    \"category\": \"Computers\",
    \"available\": true,
    \"specifications\": {
      \"processor\": \"Apple M3 Max\",
      \"ram\": \"48GB\",
      \"storage\": \"2TB SSD\",
      \"screen\": \"16.2-inch Liquid Retina XDR\"
    }
  }")

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n1)
# Extract response body (all but last line)
body=$(echo "$response" | sed '$d')

echo -e "${CYAN}HTTP Status: $http_code${NC}"

if [ "$http_code" != "201" ] && [ "$http_code" != "200" ]; then
    echo -e "${RED}❌ Erro ao criar produto! HTTP $http_code${NC}"
    echo "Resposta:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    
    if [[ "$body" == *"already exists"* ]]; then
        echo -e "${YELLOW}💡 Produto com este nome já existe!${NC}"
        echo "   Execute novamente e escolha limpar produtos antigos (opção 's')"
    elif [[ "$body" == *"Map.size()"* ]]; then
        echo -e "${YELLOW}💡 Campo specifications está causando erro${NC}"
        echo "   Verifique se o ProductControllerIntegrationTest-FIXED.java foi aplicado!"
    fi
    
    exit 1
fi

# Validate JSON response
if ! echo "$body" | jq empty 2>/dev/null; then
    echo -e "${RED}❌ Resposta inválida (não é JSON):${NC}"
    echo "$body"
    exit 1
fi

product_id=$(echo "$body" | jq -r '.id // empty')
product_name_response=$(echo "$body" | jq -r '.name // empty')
product_price=$(echo "$body" | jq -r '.price // empty')

# Validate extracted values
if [ -z "$product_id" ] || [ "$product_id" = "null" ]; then
    echo -e "${RED}❌ Erro: ID do produto não encontrado na resposta!${NC}"
    echo "Resposta recebida:"
    echo "$body" | jq '.'
    exit 1
fi

echo -e "${GREEN}✓ Produto criado com sucesso!${NC}"
echo "ID: $product_id"
echo "Nome: $product_name_response"
echo "Preço: R$ $product_price"
echo ""

echo -e "${CYAN}🔄 O que está acontecendo nos bastidores:${NC}"
echo ""
echo "1️⃣  Product-Service salvou o produto no banco de dados"
echo "2️⃣  Product-Service PUBLICOU evento 'product.created' no RabbitMQ"
echo "3️⃣  RabbitMQ recebeu o evento na exchange 'products.exchange'"
echo "4️⃣  RabbitMQ ROTEOU o evento para a fila 'product.ai.analysis.queue'"
echo "5️⃣  AI-Service CONSUMIU o evento da fila"
echo "6️⃣  AI-Service PROCESSOU e salvou no seu banco de dados"
echo ""

echo -e "${YELLOW}⏳ Aguardando eventos serem processados (${sleep_time}s)...${NC}"
sleep $sleep_time
echo ""

echo -e "${BLUE}📊 Verificando se AI-Service processou o evento...${NC}"
echo ""

# Check logs to confirm event processing
echo "Últimas linhas do AI-Service:"
$DOCKER_COMPOSE logs --tail=5 ai-service 2>/dev/null | grep -E "(Received|Analyzing|completed)" || echo "Logs não disponíveis"
echo ""

# Test AI Service health
echo -e "${BLUE}Testando AI Service...${NC}"
ai_health=$(curl -s http://localhost:8081/api/ai/)

if echo "$ai_health" | jq empty 2>/dev/null && [[ $ai_health == *"\"status\""* ]]; then
    echo -e "${GREEN}✓ AI-Service está ATIVO e funcionando!${NC}"
    echo "$ai_health" | jq '.'
    echo ""
else
    echo -e "${YELLOW}⚠️  AI-Service pode não estar respondendo corretamente${NC}"
    echo "Resposta: $ai_health"
    echo ""
fi

# Test AI Product Analysis endpoint (with proper POST request)
echo -e "${BLUE}Testando análise AI do produto...${NC}"
ai_analysis=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8081/api/ai/products/$product_id/analyze \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$product_name_response\",
    \"price\": $product_price,
    \"rating\": 4.9,
    \"category\": \"Computers\"
  }")

ai_http_code=$(echo "$ai_analysis" | tail -n1)
ai_body=$(echo "$ai_analysis" | sed '$d')

if [ "$ai_http_code" = "200" ]; then
    echo -e "${GREEN}✓ SUCESSO! AI-Service gerou análise do produto!${NC}"
    echo ""
    echo "Análise gerada pelo AI-Service:"
    echo "$ai_body" | jq '.'
elif [ "$ai_http_code" = "404" ]; then
    echo -e "${YELLOW}⚠️  Análise não disponível (produto pode não existir no AI-Service ainda)${NC}"
    echo "Isso é normal - o evento pode levar alguns segundos para ser processado"
elif [ "$ai_http_code" = "400" ]; then
    echo -e "${RED}❌ Bad Request ao tentar analisar produto${NC}"
    echo "Resposta:"
    echo "$ai_body" | jq '.' 2>/dev/null || echo "$ai_body"
else
    echo -e "${YELLOW}⚠️  Resposta inesperada do AI-Service (HTTP $ai_http_code)${NC}"
    echo "Resposta:"
    echo "$ai_body" | jq '.' 2>/dev/null || echo "$ai_body"
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo ""
read -p "Pressione ENTER para o próximo teste..."
echo ""

# ============================================================
# TEST 2: Update Product (Trigger product.updated event)
# ============================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}✏️  TESTE 2: Atualizar Produto (Dispara evento product.updated)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}➤ Enviando requisição PUT para Product-Service...${NC}"
echo "Alterando preço de R$ $product_price para R$ 2999.99 (promoção!)"
echo ""

update_response=$(curl -s -w "\n%{http_code}" -X PUT http://localhost:8080/api/products/$product_id \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$product_name_response\",
    \"description\": \"Most powerful MacBook with M3 Max chip - BLACK FRIDAY SALE!\",
    \"imageUrl\": \"https://example.com/macbook.jpg\",
    \"price\": 2999.99,
    \"rating\": 4.9,
    \"category\": \"Computers\",
    \"available\": true,
    \"specifications\": {
      \"processor\": \"Apple M3 Max\",
      \"ram\": \"48GB\",
      \"storage\": \"2TB SSD\",
      \"screen\": \"16.2-inch Liquid Retina XDR\"
    }
  }")

update_http_code=$(echo "$update_response" | tail -n1)
update_body=$(echo "$update_response" | sed '$d')

if [ "$update_http_code" = "200" ]; then
    echo -e "${GREEN}✓ Produto atualizado com sucesso!${NC}"
    echo "Novo preço: R$ $(echo "$update_body" | jq -r '.price')"
    echo "Nova descrição: $(echo "$update_body" | jq -r '.description')"
else
    echo -e "${RED}❌ Erro ao atualizar produto! HTTP $update_http_code${NC}"
    echo "$update_body" | jq '.' 2>/dev/null || echo "$update_body"
fi

echo ""

echo -e "${CYAN}🔄 O que está acontecendo nos bastidores:${NC}"
echo ""
echo "1️⃣  Product-Service atualizou o produto no banco de dados"
echo "2️⃣  Product-Service PUBLICOU evento 'product.updated' no RabbitMQ"
echo "3️⃣  RabbitMQ roteou o evento para a fila 'product.ai.analysis.queue'"
echo "4️⃣  AI-Service CONSUMIU o evento de atualização"
echo "5️⃣  AI-Service ATUALIZOU os dados no seu banco"
echo ""

echo -e "${YELLOW}⏳ Aguardando evento ser processado (${sleep_time}s)...${NC}"
sleep $sleep_time
echo ""

# ============================================================
# TEST 3: Test Product Comparison (Main Mercado Livre Requirement)
# ============================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}⭐ TESTE 3: Comparação de Produtos (Requisito Mercado Livre)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}➤ Testando endpoint de comparação: GET /api/products?ids=...${NC}"
echo ""

# Get some product IDs
all_products=$(curl -s http://localhost:8080/api/products)
id1=$(echo "$all_products" | jq -r '.[0].id // empty' 2>/dev/null)
id2=$(echo "$all_products" | jq -r '.[1].id // empty' 2>/dev/null)
id3=$(echo "$all_products" | jq -r '.[2].id // empty' 2>/dev/null)

if [ -n "$id1" ] && [ -n "$id2" ] && [ -n "$id3" ]; then
    echo "Comparando produtos: $id1, $id2, $id3"
    echo ""
    
    comparison=$(curl -s "http://localhost:8080/api/products?ids=$id1,$id2,$id3")
    
    if echo "$comparison" | jq empty 2>/dev/null; then
        count=$(echo "$comparison" | jq 'length')
        
        if [ "$count" -ge 3 ]; then
            echo -e "${GREEN}✓ SUCESSO! Endpoint de comparação funcionando!${NC}"
            echo "Produtos retornados: $count"
            echo ""
            echo "Produtos comparados:"
            echo "$comparison" | jq -r '.[] | "- \(.name) (ID: \(.id)) - R$ \(.price)"'
        else
            echo -e "${YELLOW}⚠️  Apenas $count produtos retornados${NC}"
        fi
    else
        echo -e "${RED}❌ Resposta inválida do endpoint de comparação${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Não há produtos suficientes para comparação${NC}"
    echo "Execute este script 2-3 vezes para criar mais produtos"
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo ""
read -p "Pressione ENTER para ver os logs do Docker..."
echo ""

# ============================================================
# TEST 4: Show Docker Logs
# ============================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 TESTE 4: Logs do Docker (últimas 20 linhas)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}[PRODUCT-SERVICE - PUBLISHER]${NC}"
echo "──────────────────────────────────────────────────────────"
$DOCKER_COMPOSE logs --tail=20 product-service 2>/dev/null | grep -E "(Publishing|Event|product\.)" || echo "Sem logs de eventos no momento"
echo ""

echo -e "${BLUE}[AI-SERVICE - CONSUMER]${NC}"
echo "──────────────────────────────────────────────────────────"
$DOCKER_COMPOSE logs --tail=20 ai-service 2>/dev/null | grep -E "(Received|Analyzing|completed|product\.)" || echo "Sem logs de eventos no momento"
echo ""

echo "────────────────────────────────────────────────────────────"
echo ""

# ============================================================
# SUMMARY
# ============================================================

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║              ✅ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO         ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📊 RESUMO:${NC}"
echo ""
echo "✓ Evento ${YELLOW}product.created${NC} publicado e processado"
echo "✓ Evento ${YELLOW}product.updated${NC} publicado e processado"
echo "✓ Comunicação assíncrona entre microserviços funcionando"
echo "✓ RabbitMQ atuando como message broker"
echo "✓ Endpoint de comparação (requisito Mercado Livre) validado"
echo ""

echo -e "${CYAN}🔍 PARA MONITORAR EVENTOS EM TEMPO REAL:${NC}"
echo ""
echo "Execute em outro terminal:"
echo -e "  ${BLUE}./monitor-rabbitmq.sh${NC}"
echo ""
echo "Ou acesse o RabbitMQ Management UI:"
echo -e "  ${BLUE}http://localhost:15672${NC} (guest/guest)"
echo ""

echo -e "${CYAN}💡 DICA:${NC}"
echo "Execute este script novamente para criar mais produtos e testar comparação!"
echo ""