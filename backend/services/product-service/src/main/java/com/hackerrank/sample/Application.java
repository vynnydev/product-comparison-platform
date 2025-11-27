package com.hackerrank.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Product Service - Microservice for Product Management
 * 
 * This microservice is part of the Product Comparison Platform
 * and follows Clean Architecture principles with event-driven communication.
 * 
 * Architecture:
 * - Clean Architecture (Domain, Use Cases, Adapters)
 * - SOLID Principles
 * - DDD-inspired design
 * - Event-driven with RabbitMQ
 */
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║                                                           ║\n" +
                "║           PRODUCT SERVICE - MICROSERVICE                  ║\n" +
                "║              Product Management & CRUD                    ║\n" +
                "║                                                           ║\n" +
                "║   🚀 Application started successfully!                    ║\n" +
                "║                                                           ║\n" +
                "║   📦 Microservice: Product-Service                        ║\n" +
                "║   🔌 Port: 8080                                           ║\n" +
                "║   🏗️  Architecture: Clean Architecture                   ║\n" +
                "║   📨 Messaging: RabbitMQ (Event Publisher)                ║\n" +
                "║                                                           ║\n" +
                "║   📡 API Endpoints:                                       ║\n" +
                "║      http://localhost:8080/api/products                  ║\n" +
                "║                                                           ║\n" +
                "║   📖 Swagger UI:                                          ║\n" +
                "║      http://localhost:8080/swagger-ui.html               ║\n" +
                "║                                                           ║\n" +
                "║   🗄️  H2 Console:                                         ║\n" +
                "║      http://localhost:8080/h2-console                    ║\n" +
                "║      JDBC URL: jdbc:h2:mem:productdb                     ║\n" +
                "║      Username: sa                                        ║\n" +
                "║      Password: (empty)                                   ║\n" +
                "║                                                           ║\n" +
                "║   🔄 Events Published:                                    ║\n" +
                "║      • product.created                                   ║\n" +
                "║      • product.updated                                   ║\n" +
                "║                                                           ║\n" +
                "║   ✨ Principles: SOLID, DDD-inspired                     ║\n" +
                "║                                                           ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n"
        );
    }
}