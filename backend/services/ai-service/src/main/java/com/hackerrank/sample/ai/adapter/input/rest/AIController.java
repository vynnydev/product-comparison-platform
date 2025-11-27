package com.hackerrank.sample.ai.adapter.input.rest;

import com.hackerrank.sample.ai.adapter.input.dto.*;
import com.hackerrank.sample.ai.domain.model.*;
import com.hackerrank.sample.ai.domain.service.AIService;
import com.hackerrank.sample.ai.usecase.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * AI Controller - REST API for AI-powered features.
 * 
 * This microservice provides AI capabilities for product analysis.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    private final AIService aiService;
    private final AnalyzeProductUseCase analyzeProductUseCase;
    private final EnhanceSearchUseCase enhanceSearchUseCase;
    private final CompareProductsUseCase compareProductsUseCase;
    
    @Autowired
    public AIController(
            AIService aiService,
            AnalyzeProductUseCase analyzeProductUseCase,
            EnhanceSearchUseCase enhanceSearchUseCase,
            CompareProductsUseCase compareProductsUseCase) {
        this.aiService = aiService;
        this.analyzeProductUseCase = analyzeProductUseCase;
        this.enhanceSearchUseCase = enhanceSearchUseCase;
        this.compareProductsUseCase = compareProductsUseCase;
    }
    
    /**
     * Health check - Root endpoint
     * GET /api/ai/
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "AI Service");
        response.put("status", "UP");
        response.put("aiAvailable", aiService.isAvailable());
        response.put("aiProvider", aiService.getProviderName());
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check - Standard /health endpoint
     * GET /api/ai/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return healthCheck(); // Reutiliza o método da raiz
    }
    
    /**
     * Analyze product with AI
     * 
     * POST /api/ai/products/{id}/analyze
     */
    @PostMapping("/products/{id}/analyze")
    public ResponseEntity<?> analyzeProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> productData) {
        
        if (!aiService.isAvailable()) {
            return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "error", "AI Service not available",
                    "message", "AI features are only available in cloud mode",
                    "hint", "Deploy to AWS EKS with Bedrock to enable AI"
                ));
        }
        
        // Add ID to product data
        productData.put("id", id);
        
        ProductAnalysis analysis = analyzeProductUseCase.execute(productData);
        
        // Convert to DTO
        ProductAnalysisResponseDTO dto = new ProductAnalysisResponseDTO();
        dto.setProductId(analysis.getProductId());
        dto.setProductName(analysis.getProductName());
        dto.setSummary(analysis.getSummary());
        dto.setPros(analysis.getPros());
        dto.setCons(analysis.getCons());
        dto.setTargetAudience(analysis.getTargetAudience());
        dto.setValueScore(analysis.getValueScore());
        dto.setRecommendedFor(analysis.getRecommendedFor());
        dto.setAiModel(analysis.getAiModel());
        dto.setAnalyzedAt(analysis.getAnalyzedAt());
        
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Enhance search query with AI
     * 
     * POST /api/ai/search/enhance
     */
    @PostMapping("/search/enhance")
    public ResponseEntity<?> enhanceSearch(@RequestBody SearchEnhancementRequestDTO request) {
        
        if (!aiService.isAvailable()) {
            return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "error", "AI Service not available",
                    "message", "AI search enhancement is only available in cloud mode"
                ));
        }
        
        SearchEnhancement enhancement = enhanceSearchUseCase.execute(request.getQuery());
        
        return ResponseEntity.ok(enhancement);
    }
    
    /**
     * Compare products with AI
     * 
     * POST /api/ai/products/compare
     */
    @PostMapping("/products/compare")
    public ResponseEntity<?> compareProducts(@RequestBody CompareProductsRequestDTO request) {
        
        if (!aiService.isAvailable()) {
            return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "error", "AI Service not available",
                    "message", "AI product comparison is only available in cloud mode"
                ));
        }
        
        // For now, return mock response
        // In real implementation, fetch products from product-service via HTTP/messaging
        List<Map<String, Object>> products = new ArrayList<>();
        for (Long id : request.getProductIds()) {
            Map<String, Object> product = new HashMap<>();
            product.put("id", id);
            product.put("name", "Product " + id);
            products.add(product);
        }
        
        ProductComparison comparison = compareProductsUseCase.execute(products);
        
        return ResponseEntity.ok(comparison);
    }
}