package com.hackerrank.sample.ai.usecase;

import com.hackerrank.sample.ai.domain.model.ProductAnalysis;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Use Case: Analyze product with AI.
 * 
 * Business logic:
 * 1. Validate product data
 * 2. Call AI service
 * 3. Return analysis
 */
@Service
public class AnalyzeProductUseCase {
    
    private final AIService aiService;
    
    @Autowired
    public AnalyzeProductUseCase(AIService aiService) {
        this.aiService = aiService;
    }
    
    public ProductAnalysis execute(Map<String, Object> productData) {
        // Validate required fields
        validateProductData(productData);
        
        // Analyze with AI
        return aiService.analyzeProduct(productData);
    }
    
    private void validateProductData(Map<String, Object> productData) {
        if (productData == null || productData.isEmpty()) {
            throw new IllegalArgumentException("Product data cannot be empty");
        }
        
        if (!productData.containsKey("id")) {
            throw new IllegalArgumentException("Product ID is required");
        }
        
        if (!productData.containsKey("name")) {
            throw new IllegalArgumentException("Product name is required");
        }
    }
}