#!/bin/bash
# ============================================
# SETUP GITHUB SECRETS FOR CI/CD
# Run this script to configure all required secrets
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          GITHUB SECRETS SETUP FOR CI/CD                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed.${NC}"
    echo "   Install: https://cli.github.com/"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to GitHub CLI. Running 'gh auth login'...${NC}"
    gh auth login
fi

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo -e "${YELLOW}Enter your GitHub repository (format: owner/repo):${NC}"
    read -r REPO
fi

echo -e "${GREEN}📦 Repository: ${REPO}${NC}"
echo ""

# ============================================
# AWS CREDENTIALS
# ============================================
echo -e "${BLUE}🔐 AWS Credentials${NC}"
echo "-------------------"

# AWS Account ID
echo -e "${YELLOW}Enter AWS Account ID (e.g., 347277718217):${NC}"
read -r AWS_ACCOUNT_ID
if [ -n "$AWS_ACCOUNT_ID" ]; then
    gh secret set AWS_ACCOUNT_ID --repo "$REPO" --body "$AWS_ACCOUNT_ID"
    echo -e "${GREEN}✅ AWS_ACCOUNT_ID set${NC}"
fi

# AWS Access Key
echo -e "${YELLOW}Enter AWS Access Key ID:${NC}"
read -r AWS_ACCESS_KEY_ID
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    gh secret set AWS_ACCESS_KEY_ID --repo "$REPO" --body "$AWS_ACCESS_KEY_ID"
    echo -e "${GREEN}✅ AWS_ACCESS_KEY_ID set${NC}"
fi

# AWS Secret Key
echo -e "${YELLOW}Enter AWS Secret Access Key:${NC}"
read -rs AWS_SECRET_ACCESS_KEY
echo ""
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    gh secret set AWS_SECRET_ACCESS_KEY --repo "$REPO" --body "$AWS_SECRET_ACCESS_KEY"
    echo -e "${GREEN}✅ AWS_SECRET_ACCESS_KEY set${NC}"
fi

echo ""

# ============================================
# DATABASE CREDENTIALS
# ============================================
echo -e "${BLUE}🗄️  Database Credentials${NC}"
echo "------------------------"

# DB Password
echo -e "${YELLOW}Enter PostgreSQL Password (default: ProdCompPlat135246PostgreSQL):${NC}"
read -rs DB_PASSWORD
echo ""
DB_PASSWORD=${DB_PASSWORD:-ProdCompPlat135246PostgreSQL}
gh secret set DB_PASSWORD --repo "$REPO" --body "$DB_PASSWORD"
echo -e "${GREEN}✅ DB_PASSWORD set${NC}"

# RabbitMQ Password
echo -e "${YELLOW}Enter RabbitMQ Password (default: ProdCompPlat135246RabbitMQ):${NC}"
read -rs RABBITMQ_PASSWORD
echo ""
RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD:-ProdCompPlat135246RabbitMQ}
gh secret set RABBITMQ_PASSWORD --repo "$REPO" --body "$RABBITMQ_PASSWORD"
echo -e "${GREEN}✅ RABBITMQ_PASSWORD set${NC}"

echo ""

# ============================================
# SONARQUBE (Optional)
# ============================================
echo -e "${BLUE}📊 SonarQube (Optional - press Enter to skip)${NC}"
echo "----------------------------------------------"

echo -e "${YELLOW}Enter SonarQube Host URL:${NC}"
read -r SONAR_HOST_URL
if [ -n "$SONAR_HOST_URL" ]; then
    gh secret set SONAR_HOST_URL --repo "$REPO" --body "$SONAR_HOST_URL"
    echo -e "${GREEN}✅ SONAR_HOST_URL set${NC}"
    
    echo -e "${YELLOW}Enter SonarQube Token:${NC}"
    read -rs SONAR_TOKEN
    echo ""
    if [ -n "$SONAR_TOKEN" ]; then
        gh secret set SONAR_TOKEN --repo "$REPO" --body "$SONAR_TOKEN"
        echo -e "${GREEN}✅ SONAR_TOKEN set${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Skipping SonarQube configuration${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              SECRETS SETUP COMPLETE! 🎉                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Configured Secrets:${NC}"
gh secret list --repo "$REPO"
echo ""
echo -e "${BLUE}📌 Next Steps:${NC}"
echo "   1. Push code to trigger CI pipeline"
echo "   2. Check Actions tab in GitHub for pipeline status"
echo "   3. Configure branch protection rules"
echo ""

# ============================================
# GITHUB ENVIRONMENTS (Optional)
# ============================================
echo -e "${YELLOW}Would you like to create GitHub Environments? (y/n)${NC}"
read -r CREATE_ENVS

if [ "$CREATE_ENVS" = "y" ]; then
    echo -e "${GREEN}Creating environments...${NC}"
    
    # Note: GitHub CLI doesn't support creating environments directly
    # This needs to be done via GitHub API or UI
    
    echo -e "${YELLOW}⚠️  Please create these environments manually in GitHub UI:${NC}"
    echo "   Settings → Environments → New environment"
    echo ""
    echo "   1. production"
    echo "      - Required reviewers: 2"
    echo "      - Deployment branches: main"
    echo ""
    echo "   2. staging"
    echo "      - Deployment branches: develop, staging"
    echo ""
    echo "   3. destroy (for Terraform destroy)"
    echo "      - Required reviewers: 2"
    echo "      - Wait timer: 10 minutes"
fi

echo ""
echo -e "${GREEN}Done! Your CI/CD pipeline is ready. 🚀${NC}"