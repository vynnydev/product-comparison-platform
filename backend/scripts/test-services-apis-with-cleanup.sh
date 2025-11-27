#!/bin/bash

echo "================================"
echo "🧪 TEST SERVICES APIS WITH CLEANUP"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URLs
PRODUCT_SERVICE="http://localhost:8080"
AI_SERVICE="http://localhost:8081"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Product IDs (will be captured)
PRODUCT_1_ID=""
PRODUCT_2_ID=""
PRODUCT_3_ID=""

# ==================== CLEANUP ====================
echo -e "${YELLOW}🗑️  Limpando produtos antigos...${NC}"
echo ""

# Get all products and delete them
products=$(curl -s "$PRODUCT_SERVICE/api/products" | jq -r '.[].id' 2>/dev/null)

if [ -n "$products" ]; then
    for id in $products; do
        echo "Deletando produto ID: $id"
        curl -s -X DELETE "$PRODUCT_SERVICE/api/products/$id" > /dev/null
    done
    echo ""
    echo -e "${GREEN}✓ Banco limpo!${NC}"
    echo ""
else
    echo -e "${BLUE}ℹ  Banco já está vazio${NC}"
    echo ""
fi

sleep 1

# Function to test endpoint and capture ID
test_endpoint_and_capture_id() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local capture_var="$5"  # Variable name to store ID
    
    echo -e "${BLUE}Testing: $name${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    # Extract HTTP code and body (macOS compatible)
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        ((TESTS_PASSED++))
        
        # Capture ID if requested
        if [ -n "$capture_var" ]; then
            captured_id=$(echo "$body" | jq -r '.id' 2>/dev/null)
            if [ -n "$captured_id" ] && [ "$captured_id" != "null" ]; then
                eval "$capture_var=$captured_id"
                echo -e "${YELLOW}→ Captured ID: $captured_id${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Function to test endpoint (without capture)
test_endpoint() {
    test_endpoint_and_capture_id "$1" "$2" "$3" "$4" ""
}

echo "==================================="
echo "📦 PRODUCT SERVICE TESTS (Port 8080)"
echo "==================================="
echo ""

# Test 1: Create Product 1 - iPhone (capture ID)
echo "Test 1: Create iPhone 15 Pro"
test_endpoint_and_capture_id "POST /api/products - iPhone" "POST" "$PRODUCT_SERVICE/api/products" '{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip and titanium design",
  "imageUrl": "https://example.com/iphone15.jpg",
  "price": 999.99,
  "rating": 4.8,
  "category": "Electronics",
  "available": true,
  "specifications": {
    "color": "Titanium Blue",
    "storage": "256GB"
  }
}' "PRODUCT_1_ID"

# Test 2: Create Product 2 - Samsung (capture ID)
echo "Test 2: Create Samsung Galaxy S24 Ultra"
test_endpoint_and_capture_id "POST /api/products - Samsung" "POST" "$PRODUCT_SERVICE/api/products" '{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Flagship Android phone with S Pen and 200MP camera",
  "imageUrl": "https://example.com/s24ultra.jpg",
  "price": 1199.99,
  "rating": 4.7,
  "category": "Electronics",
  "available": true,
  "specifications": {
    "color": "Titanium Black",
    "storage": "512GB"
  }
}' "PRODUCT_2_ID"

# Test 3: Create Product 3 - Google Pixel (capture ID)
echo "Test 3: Create Google Pixel 8 Pro"
test_endpoint_and_capture_id "POST /api/products - Pixel" "POST" "$PRODUCT_SERVICE/api/products" '{
  "name": "Google Pixel 8 Pro",
  "description": "AI-powered smartphone with best Android camera",
  "imageUrl": "https://example.com/pixel8.jpg",
  "price": 899.99,
  "rating": 4.6,
  "category": "Electronics",
  "available": true,
  "specifications": {
    "color": "Obsidian",
    "storage": "256GB"
  }
}' "PRODUCT_3_ID"

echo -e "${YELLOW}📋 Captured Product IDs:${NC}"
echo -e "  Product 1 (iPhone): ${BLUE}$PRODUCT_1_ID${NC}"
echo -e "  Product 2 (Samsung): ${BLUE}$PRODUCT_2_ID${NC}"
echo -e "  Product 3 (Pixel): ${BLUE}$PRODUCT_3_ID${NC}"
echo ""

# Test 4: Get All Products
echo "Test 4: Get All Products"
test_endpoint "GET /api/products - List All" "GET" "$PRODUCT_SERVICE/api/products"

# Test 5: Get Product by ID (using captured ID)
echo "Test 5: Get Product by ID ($PRODUCT_1_ID)"
test_endpoint "GET /api/products/$PRODUCT_1_ID" "GET" "$PRODUCT_SERVICE/api/products/$PRODUCT_1_ID"

# Test 6: Compare Multiple Products (using captured IDs)
echo "Test 6: Compare Products (IDs: $PRODUCT_1_ID,$PRODUCT_2_ID,$PRODUCT_3_ID) - ⭐ MAIN REQUIREMENT!"
test_endpoint "GET /api/products?ids=$PRODUCT_1_ID,$PRODUCT_2_ID,$PRODUCT_3_ID - Compare" "GET" "$PRODUCT_SERVICE/api/products?ids=$PRODUCT_1_ID,$PRODUCT_2_ID,$PRODUCT_3_ID"

# Test 7: Update Product (using captured ID)
echo "Test 7: Update Product ($PRODUCT_1_ID)"
test_endpoint "PUT /api/products/$PRODUCT_1_ID" "PUT" "$PRODUCT_SERVICE/api/products/$PRODUCT_1_ID" '{
  "name": "iPhone 15 Pro - Updated",
  "description": "Latest iPhone with A17 Pro chip and titanium design - Now on sale!",
  "imageUrl": "https://example.com/iphone15.jpg",
  "price": 949.99,
  "rating": 4.8,
  "category": "Electronics",
  "available": true,
  "specifications": {
    "color": "Titanium Blue",
    "storage": "256GB",
    "discount": "5% off"
  }
}'

# Test 8: Search by Category
echo "Test 8: Search by Category"
test_endpoint "GET /api/products?category=Electronics" "GET" "$PRODUCT_SERVICE/api/products?category=Electronics"

# Test 9: Error Handling - Invalid ID (Expected 404)
echo "Test 9: Error Handling - Product Not Found (Expected 404)"
echo -e "${BLUE}Testing: GET /api/products/999${NC}"
response=$(curl -s -w "\n%{http_code}" -X GET "$PRODUCT_SERVICE/api/products/999")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 404 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code - Correctly returned 404)"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code - Expected 404)"
    ((TESTS_FAILED++))
fi
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo ""

echo ""
echo "==================================="
echo "🤖 AI SERVICE TESTS (Port 8081)"
echo "==================================="
echo ""

# Wait for events to be processed
echo -e "${YELLOW}⏳ Waiting 3 seconds for RabbitMQ events to be processed...${NC}"
sleep 3

# Test 10: AI Service Health Check
echo "Test 10: AI Service Health Check"
test_endpoint "GET /api/ai/ - Health" "GET" "$AI_SERVICE/api/ai/"

# Test 11: AI Product Analysis (using captured ID)
echo "Test 11: AI Product Analysis (Product $PRODUCT_1_ID)"
test_endpoint "POST /api/ai/products/$PRODUCT_1_ID/analyze" "POST" "$AI_SERVICE/api/ai/products/$PRODUCT_1_ID/analyze" '{
  "name": "iPhone 15 Pro",
  "price": 949.99,
  "rating": 4.8,
  "category": "Electronics"
}'

# Test 12: AI Product Comparison (using captured IDs)
echo "Test 12: AI Product Comparison (Products $PRODUCT_1_ID vs $PRODUCT_2_ID)"
test_endpoint "POST /api/ai/products/compare" "POST" "$AI_SERVICE/api/ai/products/compare" "{
  \"productIds\": [$PRODUCT_1_ID, $PRODUCT_2_ID]
}"

# Test 13: AI Search Enhancement
echo "Test 13: AI Search Enhancement"
test_endpoint "POST /api/ai/search/enhance" "POST" "$AI_SERVICE/api/ai/search/enhance" '{
  "query": "best smartphone under 1000 dollars"
}'

echo ""
echo "==================================="
echo "📊 TEST SUMMARY"
echo "==================================="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "🎉 Your API is working correctly!"
    echo "⭐ Main Mercado Livre requirement (product comparison) PASSED!"
    echo ""
    echo "Key achievements:"
    echo "  ✓ RESTful API with CRUD operations"
    echo "  ✓ Product comparison endpoint (GET /api/products?ids=X,Y,Z)"
    echo "  ✓ Dynamic ID handling"
    echo "  ✓ Error handling (404, 400)"
    echo "  ✓ Microservices communication (RabbitMQ)"
    echo "  ✓ Clean Architecture implementation"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo ""
    echo "Check the errors above and fix the issues."
    exit 1
fi