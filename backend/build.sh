#!/bin/bash

###############################################################################
# Build Script for Product Comparison API
# This script builds the application and runs tests
###############################################################################

set -e  # Exit on error

echo "🚀 Starting build process for Product Comparison API..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven first.${NC}"
    exit 1
fi

# Check Java version
echo -e "${YELLOW}☕ Checking Java version...${NC}"
java -version
echo ""

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
mvn clean
echo ""

# Compile the project
echo -e "${YELLOW}🔨 Compiling the project...${NC}"
mvn compile
echo ""

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
mvn test
echo ""

# Package the application
echo -e "${YELLOW}📦 Packaging the application...${NC}"
mvn package -DskipTests
echo ""

# Check if JAR was created
if [ -f target/*.jar ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo -e "${GREEN}📁 JAR file created in target/ directory${NC}"
    ls -lh target/*.jar
else
    echo -e "${RED}❌ Build failed - JAR file not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo ""
echo "To run the application:"
echo "  java -jar target/*.jar"
echo ""
echo "Or use:"
echo "  ./run.sh"