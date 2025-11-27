package com.hackerrank.sample;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackerrank.sample.adapter.input.dto.ProductRequestDTO;
import com.hackerrank.sample.adapter.output.persistence.ProductJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")  // ← Ativa perfil "test" para @Profile("!test") funcionar
@AutoConfigureMockMvc
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductJpaRepository productRepository;

    @BeforeEach
    void setUp() {
        // Limpar banco antes de cada teste
        productRepository.deleteAll();
    }

    @Test
    public void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/"))
                .andExpect(status().isOk())
                .andExpect(content().string("Product Comparison API - Clean Architecture v1.0"));
    }

    @Test
    public void shouldCreateProduct() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "iPhone 15",
                "Apple iPhone 15",
                "https://example.com/iphone15.jpg",
                new BigDecimal("1299.99"),
                4.8,
                "Smartphones"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("iPhone 15"))
                .andExpect(jsonPath("$.price").value(1299.99))
                .andExpect(jsonPath("$.category").value("Smartphones"));
    }

    @Test
    public void shouldGetAllProducts() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "Test Product",
                "Test Description",
                "https://example.com/test.jpg",
                new BigDecimal("999.99"),
                4.5,
                "Electronics"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Test Product"));
    }

    @Test
    public void shouldGetProductById() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "Test Product",
                "Test Description",
                "https://example.com/test.jpg",
                new BigDecimal("999.99"),
                4.5,
                "Electronics"
        );

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    public void shouldUpdateProduct() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "Original Name",
                "Original Description",
                "https://example.com/original.jpg",
                new BigDecimal("999.99"),
                4.5,
                "Electronics"
        );

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(response).get("id").asLong();

        ProductRequestDTO updateDTO = createSampleProductRequest(
                "Updated Name",
                "Updated Description",
                "https://example.com/updated.jpg",
                new BigDecimal("1099.99"),
                4.7,
                "Electronics"
        );

        mockMvc.perform(put("/api/products/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId))
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.price").value(1099.99));
    }

    @Test
    public void shouldDeleteProduct() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "To Delete",
                "Product to be deleted",
                "https://example.com/delete.jpg",
                new BigDecimal("499.99"),
                4.0,
                "Electronics"
        );

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/products/" + productId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldGetProductsByCategory() throws Exception {
        ProductRequestDTO smartphone = createSampleProductRequest(
                "iPhone 15",
                "Apple smartphone",
                "https://example.com/iphone.jpg",
                new BigDecimal("1299.99"),
                4.8,
                "Smartphones"
        );

        ProductRequestDTO laptop = createSampleProductRequest(
                "MacBook Pro",
                "Apple laptop",
                "https://example.com/macbook.jpg",
                new BigDecimal("2499.99"),
                4.9,
                "Laptops"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(smartphone)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(laptop)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/products/category/Smartphones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].category").value("Smartphones"));
    }

    @Test
    public void shouldSearchProductsByName() throws Exception {
        ProductRequestDTO requestDTO = createSampleProductRequest(
                "iPhone 15 Pro Max",
                "Apple flagship",
                "https://example.com/iphone.jpg",
                new BigDecimal("1399.99"),
                4.9,
                "Smartphones"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/products/search?keyword=iPhone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("iPhone 15 Pro Max"));
    }

    @Test
    public void shouldCompareMultipleProducts() throws Exception {
        ProductRequestDTO iphone = createSampleProductRequest(
                "iPhone 15 Pro",
                "Apple flagship smartphone",
                "https://example.com/iphone15.jpg",
                new BigDecimal("1299.99"),
                4.8,
                "Smartphones"
        );

        ProductRequestDTO samsung = createSampleProductRequest(
                "Samsung Galaxy S24",
                "Samsung flagship smartphone",
                "https://example.com/galaxys24.jpg",
                new BigDecimal("999.99"),
                4.7,
                "Smartphones"
        );

        ProductRequestDTO pixel = createSampleProductRequest(
                "Google Pixel 8",
                "Google flagship smartphone",
                "https://example.com/pixel8.jpg",
                new BigDecimal("699.99"),
                4.6,
                "Smartphones"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(iphone)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(samsung)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pixel)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/products/category/Smartphones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    public void shouldPerformCompleteCRUDWorkflow() throws Exception {
        // CREATE
        ProductRequestDTO createDTO = createSampleProductRequest(
                "CRUD Test Product",
                "Testing complete CRUD workflow",
                "https://example.com/crud.jpg",
                new BigDecimal("799.99"),
                4.5,
                "Electronics"
        );

        String createResponse = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(createResponse).get("id").asLong();

        // READ
        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("CRUD Test Product"));

        // UPDATE
        ProductRequestDTO updateDTO = createSampleProductRequest(
                "CRUD Updated Product",
                "Updated description",
                "https://example.com/crud-updated.jpg",
                new BigDecimal("899.99"),
                4.7,
                "Electronics"
        );

        mockMvc.perform(put("/api/products/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("CRUD Updated Product"));

        // DELETE
        mockMvc.perform(delete("/api/products/" + productId))
                .andExpect(status().isNoContent());

        // VERIFY DELETED
        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isNotFound());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HELPER METHOD - SEM setAvailable() que não existe no seu DTO!
    // ═══════════════════════════════════════════════════════════════════════
    
    private ProductRequestDTO createSampleProductRequest(
            String name,
            String description,
            String imageUrl,
            BigDecimal price,
            Double rating,
            String category) {
        
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName(name);
        dto.setDescription(description);
        dto.setImageUrl(imageUrl);
        dto.setPrice(price);
        dto.setRating(rating);
        dto.setCategory(category);
        // dto.setAvailable(true);  ← REMOVIDO! Não existe no seu DTO
        
        Map<String, String> specs = new HashMap<>();
        specs.put("color", "Black");
        specs.put("storage", "256GB");
        dto.setSpecifications(specs);
        
        return dto;
    }
}