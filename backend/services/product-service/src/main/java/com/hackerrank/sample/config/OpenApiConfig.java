package com.hackerrank.sample.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * OpenAPI (Swagger) configuration for API documentation.
 * 
 * Access the interactive documentation at:
 * - Swagger UI: http://localhost:8080/swagger-ui.html
 * - API Docs JSON: http://localhost:8080/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI productComparisonOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Comparison API")
                        .description("""
                                RESTful API for Product Comparison Feature
                                
                                This API provides endpoints to manage products for an item comparison feature.
                                It supports CRUD operations, filtering, and searching products.
                                
                                **Key Features:**
                                - Create, Read, Update, Delete products
                                - Filter by category, price range, and rating
                                - Search products by name
                                - Flexible product specifications
                                
                                **Technical Stack:**
                                - Java 21
                                - Spring Boot 3.2.0
                                - Spring Data JPA
                                - H2 In-Memory Database
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Backend Developer IA Team")
                                .email("backend@example.com")
                                .url("https://github.com/your-repo"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(Arrays.asList(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.example.com")
                                .description("Production Server (placeholder)")
                ))
                .tags(Arrays.asList(
                        new Tag()
                                .name("Products")
                                .description("Product management endpoints"),
                        new Tag()
                                .name("Search & Filter")
                                .description("Product search and filtering operations"),
                        new Tag()
                                .name("Health")
                                .description("API health check endpoints")
                ));
    }
}