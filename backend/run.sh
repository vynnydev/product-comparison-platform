#!/bin/bash

###############################################################################
# Run Script for Product Comparison API
# This script runs the application locally
###############################################################################

set -e

echo "🚀 Starting Product Comparison API..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if JAR exists
if [ ! -f target/*.jar ]; then
    echo -e "${YELLOW}⚠️  JAR file not found. Building the project first...${NC}"
    ./build.sh
fi

# Set profile (default to dev)
PROFILE=${1:-dev}

echo -e "${GREEN}🌱 Running with profile: $PROFILE${NC}"
echo ""

# Run the application
java -jar target/*.jar --spring.profiles.active=$PROFILE

# Alternative using Maven
# mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE