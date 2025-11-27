package com.hackerrank.sample.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AI Service - Microservice for AI-Powered Product Analysis
 * 
 * This microservice provides intelligent product analysis capabilities
 * using AI/ML models (AWS Bedrock Claude in production, Mock in local).
 * 
 * Features:
 * - AI-powered product analysis and insights
 * - Smart search query enhancement
 * - Intelligent product comparison
 * - Automatic event processing from Product-Service
 * 
 * Architecture:
 * - Clean Architecture (Domain, Use Cases, Adapters)
 * - Event-driven consumer (RabbitMQ)
 * - REST API for synchronous requests
 * - Profile-based AI provider (mock/bedrock)
 * 
 * Message Flow:
 * 1. Product-Service publishes events → products.exchange
 * 2. RabbitMQ routes events → product.ai.analysis.queue
 * 3. AI-Service consumes events → processes with AI
 * 4. AI-Service stores analysis → PostgreSQL (aidb)
 */
@SpringBootApplication
public class AIApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AIApplication.class, args);
        
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║                                                           ║\n" +
                "║              AI SERVICE - MICROSERVICE                    ║\n" +
                "║           AI-Powered Product Intelligence                 ║\n" +
                "║                                                           ║\n" +
                "║   🚀 Application started successfully!                    ║\n" +
                "║                                                           ║\n" +
                "║   📦 Microservice: AI-Service                             ║\n" +
                "║   🔌 Port: 8081                                           ║\n" +
                "║   🏗️  Architecture: Clean Architecture                   ║\n" +
                "║   📨 Messaging: RabbitMQ (Event Consumer)                 ║\n" +
                "║                                                           ║\n" +
                "║   🤖 AI Features:                                         ║\n" +
                "║      • Product Analysis                                  ║\n" +
                "║      • Search Enhancement                                ║\n" +
                "║      • Product Comparison                                ║\n" +
                "║      • Automatic Event Processing                        ║\n" +
                "║                                                           ║\n" +
                "║   📡 API Endpoints:                                       ║\n" +
                "║      http://localhost:8081/api/ai                        ║\n" +
                "║                                                           ║\n" +
                "║   📖 Swagger UI:                                          ║\n" +
                "║      http://localhost:8081/swagger-ui.html               ║\n" +
                "║                                                           ║\n" +
                "║   🔄 RabbitMQ Configuration:                              ║\n" +
                "║      Exchange: products.exchange                         ║\n" +
                "║      Queue: product.ai.analysis.queue                    ║\n" +
                "║      Routing Keys: product.created, product.updated      ║\n" +
                "║                                                           ║\n" +
                "║   📥 Events Consumed:                                     ║\n" +
                "║      • PRODUCT_CREATED  → Analyze new products           ║\n" +
                "║      • PRODUCT_UPDATED  → Update analysis                ║\n" +
                "║                                                           ║\n" +
                "║   💾 Database: PostgreSQL (aidb)                          ║\n" +
                "║      Stores AI analysis results and insights             ║\n" +
                "║                                                           ║\n" +
                "║   🧠 AI Provider: Mock (Local Development)                ║\n" +
                "║      (AWS Bedrock Claude 4.5 in production)              ║\n" +
                "║                                                           ║\n" +
                "║   ✨ Principles: SOLID, Event-Driven, ML-Ready           ║\n" +
                "║                                                           ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n"
        );
    }
}