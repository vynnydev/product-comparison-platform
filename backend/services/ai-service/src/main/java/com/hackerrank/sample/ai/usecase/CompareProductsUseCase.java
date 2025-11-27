package com.hackerrank.sample.ai.usecase;

import com.hackerrank.sample.ai.domain.model.ProductComparison;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Use Case: Compare multiple products with AI.
 */
@Service
public class CompareProductsUseCase {
    
    private final AIService aiService;
    
    @Autowired
    public CompareProductsUseCase(AIService aiService) {
        this.aiService = aiService;
    }
    
    public ProductComparison execute(List<Map<String, Object>> products) {
        // Validate
        if (products == null || products.size() < 2) {
            throw new IllegalArgumentException("At least 2 products are required for comparison");
        }
        
        if (products.size() > 5) {
            throw new IllegalArgumentException("Maximum 5 products can be compared at once");
        }
        
        // Compare with AI
        return aiService.compareProducts(products);
    }
}