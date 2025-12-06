#!/bin/bash

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_NAME="product-comparison"
ENVIRONMENT="dev"
BUCKET_NAME="${PROJECT_NAME}-${ENVIRONMENT}-terraform-state"
TABLE_NAME="${PROJECT_NAME}-${ENVIRONMENT}-terraform-locks"

echo ""
echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}║              ⚠️  DESTROY TERRAFORM BACKEND ⚠️                  ║${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}║  This will delete:                                            ║${NC}"
echo -e "${RED}║    • S3 Bucket: $BUCKET_NAME${NC}"
echo -e "${RED}║    • DynamoDB Table: $TABLE_NAME${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}║  ⚠️  ALL TERRAFORM STATE WILL BE LOST! ⚠️                      ║${NC}"
echo -e "${RED}║                                                               ║${NC}"
echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Type 'destroy-backend' to confirm: " CONFIRM

if [ "$CONFIRM" != "destroy-backend" ]; then
    echo -e "${YELLOW}❌ Backend destruction cancelled${NC}"
    exit 0
fi

echo ""
read -p "Are you ABSOLUTELY SURE? Type 'yes': " CONFIRM2

if [ "$CONFIRM2" != "yes" ]; then
    echo -e "${YELLOW}❌ Backend destruction cancelled${NC}"
    exit 0
fi

# Get script directory and navigate to bootstrap
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/../../infraestructure/terraform/modules/bootstrap"

echo ""
echo -e "${RED}🗑️  Planning to destroy Terraform backend...${NC}"
echo ""
terraform plan -destroy -out tfplan

echo ""
echo -e "${RED}🗑️  Destroying Terraform backend...${NC}"
echo ""
terraform apply tfplan

echo ""
echo -e "${GREEN}✅ Backend destroyed successfully${NC}"
echo ""
echo -e "${CYAN}S3 bucket and DynamoDB table have been deleted.${NC}"
echo -e "${CYAN}You will need to recreate them before deploying again.${NC}"
echo ""