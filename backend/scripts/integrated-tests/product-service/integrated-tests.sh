#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║        🧪 EXECUTANDO TESTES - PRODUCT-SERVICE              ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to product-service directory (3 levels up from scripts/integrated-tests/product-service)
cd "$SCRIPT_DIR/../../../services/product-service" || {
    echo -e "${RED}❌ Erro: Diretório product-service não encontrado${NC}"
    echo "   Esperado: $SCRIPT_DIR/../../../services/product-service"
    exit 1
}

echo -e "${CYAN}📍 Diretório atual: $(pwd)${NC}"
echo ""

# ==================== VALIDATION: Check @Profile in DatabaseSeeder ====================

echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}🔍 VALIDAÇÃO: Verificando configuração do DatabaseSeeder${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""

SEEDER_FILE=$(find src/main/java -name "DatabaseSeeder.java" 2>/dev/null | head -1)

if [ -n "$SEEDER_FILE" ]; then
    if grep -q '@Profile("!test")' "$SEEDER_FILE" || grep -q "@Profile(\"!test\")" "$SEEDER_FILE"; then
        echo -e "${GREEN}✓ DatabaseSeeder está configurado com @Profile(\"!test\")${NC}"
        echo -e "${GREEN}  Arquivo: $SEEDER_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  DatabaseSeeder NÃO tem @Profile(\"!test\")${NC}"
        echo -e "${YELLOW}  Arquivo: $SEEDER_FILE${NC}"
        echo ""
        echo -e "${CYAN}💡 RECOMENDAÇÃO:${NC}"
        echo "  1. Adicione @Profile(\"!test\") no DatabaseSeeder.java"
        echo "  2. Recompile: mvn clean package -DskipTests"
        echo "  3. Execute os testes novamente"
        echo ""
        read -p "Continuar mesmo assim? (s/n): " continue_anyway
        if [[ $continue_anyway != "s" && $continue_anyway != "S" ]]; then
            echo "Saindo..."
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  DatabaseSeeder.java não encontrado${NC}"
fi

echo ""

# ==================== OPTION 0: Clean Database ====================

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🗑️  LIMPEZA DE DADOS - Recomendado antes dos testes${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Os testes criam produtos com nomes específicos."
echo "Se esses produtos já existem no banco, os testes falham com HTTP 400."
echo ""
echo -e "${CYAN}⚠️  Limpar banco remove TODOS os produtos do Product-Service${NC}"
echo ""

read -p "Limpar banco de dados antes dos testes? (s/n): " clean_db

if [[ $clean_db == "s" || $clean_db == "S" ]]; then
    echo ""
    echo -e "${YELLOW}⏳ Limpando banco de dados...${NC}"
    
    # Verificar se serviço está rodando
    if ! curl -s http://localhost:8080/api/products > /dev/null 2>&1; then
        echo -e "${RED}❌ Product-Service não está respondendo${NC}"
        echo "   Inicie o serviço: docker compose up -d"
        exit 1
    fi
    
    # Buscar todos os produtos
    products=$(curl -s http://localhost:8080/api/products)
    
    if echo "$products" | jq empty 2>/dev/null; then
        # Contar produtos
        product_count=$(echo "$products" | jq 'length' 2>/dev/null)
        
        if [ "$product_count" -eq 0 ]; then
            echo -e "${CYAN}ℹ️  Banco já está vazio${NC}"
        else
            echo -e "${CYAN}Encontrados $product_count produtos no banco${NC}"
            
            # Deletar cada produto
            product_ids=$(echo "$products" | jq -r '.[].id' 2>/dev/null)
            deleted=0
            
            for id in $product_ids; do
                if curl -s -X DELETE "http://localhost:8080/api/products/$id" > /dev/null 2>&1; then
                    ((deleted++))
                fi
            done
            
            echo -e "${GREEN}✓ $deleted produto(s) deletado(s)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Não foi possível acessar a API${NC}"
        echo "   Verifique se Product-Service está rodando"
    fi
    
    echo ""
    echo -e "${YELLOW}⏳ Aguardando 2 segundos...${NC}"
    sleep 2
    echo ""
fi

# ==================== OPTION 1: Run All Tests ====================

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 OPÇÃO 1: Executar TODOS os testes${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

read -p "Executar todos os testes? (s/n): " run_all

if [[ $run_all == "s" || $run_all == "S" ]]; then
    echo ""
    echo -e "${YELLOW}⏳ Executando todos os testes...${NC}"
    echo ""
    
    mvn clean test
    
    test_result=$?
    
    echo ""
    if [ $test_result -eq 0 ]; then
        echo -e "${GREEN}✓ TODOS OS TESTES PASSARAM COM SUCESSO!${NC}"
    else
        echo -e "${RED}✗ ALGUNS TESTES FALHARAM${NC}"
        echo ""
        echo -e "${CYAN}💡 DICAS DE TROUBLESHOOTING:${NC}"
        echo "1. Se erro é 'Status expected:<204> but was:<200>':"
        echo "   → ProductController precisa retornar 204 no DELETE"
        echo ""
        echo "2. Se erro é 'Status expected:<201> but was:<400>':"
        echo "   → Produtos já existem no banco (DatabaseSeeder rodou)"
        echo "   → Adicione @Profile(\"!test\") no DatabaseSeeder.java"
        echo "   → Recompile: mvn clean package -DskipTests"
        echo "   → Ou execute novamente e limpe o banco (opção 's')"
        echo ""
    fi
    echo ""
fi

# ==================== OPTION 2: Run Integration Test ====================

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 OPÇÃO 2: Executar teste de integração${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Teste disponível:"
echo "  → ProductControllerIntegrationTest (testes de integração REST)"
echo ""

read -p "Executar ProductControllerIntegrationTest? (s/n): " run_integration

if [[ $run_integration == "s" || $run_integration == "S" ]]; then
    echo ""
    echo -e "${YELLOW}⏳ Executando ProductControllerIntegrationTest...${NC}"
    echo ""
    
    mvn test -Dtest=ProductControllerIntegrationTest
    
    test_result=$?
    
    echo ""
    if [ $test_result -eq 0 ]; then
        echo -e "${GREEN}✓ ProductControllerIntegrationTest concluído com SUCESSO!${NC}"
    else
        echo -e "${RED}✗ ProductControllerIntegrationTest FALHOU${NC}"
        echo ""
        echo -e "${CYAN}💡 DICAS:${NC}"
        echo "1. Adicione @Profile(\"!test\") no DatabaseSeeder"
        echo "2. Limpe o banco antes dos testes"
        echo "3. Corrija ProductController para retornar 204 no DELETE"
        echo ""
    fi
    echo ""
fi

# ==================== OPTION 3: Generate Coverage Report ====================

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 OPÇÃO 3: Gerar relatório de cobertura${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if jacoco plugin is configured
if grep -q "jacoco" pom.xml 2>/dev/null; then
    echo -e "${GREEN}✓ Plugin JaCoCo detectado no pom.xml${NC}"
    echo ""
    
    read -p "Gerar relatório de cobertura? (s/n): " gen_coverage
    
    if [[ $gen_coverage == "s" || $gen_coverage == "S" ]]; then
        echo ""
        echo -e "${YELLOW}⏳ Gerando relatório de cobertura...${NC}"
        echo ""
        
        mvn clean test jacoco:report
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✓ Relatório gerado em: target/site/jacoco/index.html${NC}"
            echo ""
            echo "Abra o arquivo em seu navegador para ver a cobertura!"
        else
            echo ""
            echo -e "${RED}❌ Erro ao gerar relatório${NC}"
        fi
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Plugin JaCoCo não está configurado no pom.xml${NC}"
    echo ""
    echo -e "${CYAN}Para adicionar JaCoCo, inclua no pom.xml:${NC}"
    echo ""
    echo "<build>"
    echo "  <plugins>"
    echo "    <plugin>"
    echo "      <groupId>org.jacoco</groupId>"
    echo "      <artifactId>jacoco-maven-plugin</artifactId>"
    echo "      <version>0.8.11</version>"
    echo "      <executions>"
    echo "        <execution>"
    echo "          <goals>"
    echo "            <goal>prepare-agent</goal>"
    echo "          </goals>"
    echo "        </execution>"
    echo "        <execution>"
    echo "          <id>report</id>"
    echo "          <phase>test</phase>"
    echo "          <goals>"
    echo "            <goal>report</goal>"
    echo "          </goals>"
    echo "        </execution>"
    echo "      </executions>"
    echo "    </plugin>"
    echo "  </plugins>"
    echo "</build>"
    echo ""
    echo "Depois execute: mvn clean test jacoco:report"
    echo ""
fi

# ==================== SUMMARY ====================

echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📋 RESUMO DOS TESTES${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

if compgen -G "target/surefire-reports/TEST-*.xml" > /dev/null 2>/dev/null; then
    total_tests=$(grep -o 'tests="[0-9]*"' target/surefire-reports/TEST-*.xml 2>/dev/null | sed 's/tests="//' | sed 's/"//' | awk '{s+=$1} END {print s}')
    failed_tests=$(grep -o 'failures="[0-9]*"' target/surefire-reports/TEST-*.xml 2>/dev/null | sed 's/failures="//' | sed 's/"//' | awk '{s+=$1} END {print s}')
    error_tests=$(grep -o 'errors="[0-9]*"' target/surefire-reports/TEST-*.xml 2>/dev/null | sed 's/errors="//' | sed 's/"//' | awk '{s+=$1} END {print s}')
    
    passed_tests=$((total_tests - failed_tests - error_tests))
    
    echo -e "${GREEN}Testes Passados: $passed_tests${NC}"
    echo -e "${RED}Testes Falhados: $failed_tests${NC}"
    echo -e "${RED}Testes com Erro: $error_tests${NC}"
    echo -e "${CYAN}Total de Testes: $total_tests${NC}"
    echo ""
    
    # Show success rate
    if [ $total_tests -gt 0 ]; then
        success_rate=$((passed_tests * 100 / total_tests))
        
        if [ $success_rate -eq 100 ]; then
            echo -e "${GREEN}Taxa de Sucesso: 100% 🎉${NC}"
        elif [ $success_rate -ge 80 ]; then
            echo -e "${YELLOW}Taxa de Sucesso: ${success_rate}% ⚠️${NC}"
        else
            echo -e "${RED}Taxa de Sucesso: ${success_rate}% ❌${NC}"
        fi
        echo ""
    fi
    
    # Show failed tests
    if [ $failed_tests -gt 0 ]; then
        echo -e "${RED}Testes que falharam:${NC}"
        grep -h 'testcase.*name=' target/surefire-reports/*.xml 2>/dev/null | \
            grep -v 'time="0"' | \
            sed 's/.*name="\([^"]*\)".*/  - \1/' | \
            head -10 || echo "  (detalhes nos relatórios XML)"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Nenhum relatório de teste encontrado${NC}"
    echo "   Execute os testes primeiro (opções 1 ou 2)"
    echo ""
fi

echo -e "${CYAN}📁 Relatórios disponíveis em:${NC}"
echo "  - target/surefire-reports/ (relatórios XML/TXT)"
if [ -d "target/site/jacoco" ]; then
    echo "  - target/site/jacoco/ (cobertura de código)"
fi
echo ""

echo -e "${GREEN}✓ Script concluído!${NC}"
echo ""

# Show next steps if there are failures
if [ "${failed_tests:-0}" -gt 0 ]; then
    echo -e "${YELLOW}📝 PRÓXIMOS PASSOS:${NC}"
    echo ""
    echo "1. ✅ Adicionar @Profile(\"!test\") no DatabaseSeeder.java"
    echo "   Arquivo: $SEEDER_FILE"
    echo ""
    echo "2. ✅ Recompilar projeto:"
    echo "   mvn clean package -DskipTests"
    echo ""
    echo "3. ✅ Executar testes novamente:"
    echo "   ./integrated-tests.sh"
    echo ""
    echo "Arquivos de ajuda:"
    echo "  - DatabaseSeeder-REAL-CORRIGIDO.java"
    echo "  - CORRECAO-DATABASESEEDER-REAL.txt"
    echo ""
fi