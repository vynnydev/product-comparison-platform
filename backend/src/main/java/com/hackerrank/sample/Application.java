package com.hackerrank.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Class
 * 
 * Spring Boot application following Clean Architecture principles.
 * 
 * Architecture Layers:
 * - Domain (Entities, Value Objects, Repository Interfaces)
 * - Use Cases (Application Business Rules)
 * - Adapters (Controllers, DTOs, Repository Implementations)
 * - Infrastructure (Spring, JPA, H2)
 */
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║                                                           ║\n" +
                "║       Product Comparison API - Clean Architecture         ║\n" +
                "║                                                           ║\n" +
                "║   🚀 Application started successfully!                    ║\n" +
                "║                                                           ║\n" +
                "║   📡 API Base URL:                                        ║\n" +
                "║      http://localhost:8080/api                           ║\n" +
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
                "║   🏗️  Architecture: Clean Architecture                   ║\n" +
                "║   ✨ Principles: SOLID, DDD-inspired                     ║\n" +
                "║                                                           ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n"
        );
    }
}