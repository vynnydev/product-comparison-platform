package com.hackerrank.sample.ai.domain.service;  // ✅ CORRETO

import com.hackerrank.sample.ai.domain.model.ProductAnalysis;
import com.hackerrank.sample.ai.domain.model.ProductComparison;
import com.hackerrank.sample.ai.domain.model.SearchEnhancement;

import java.util.List;
import java.util.Map;

/**
 * Port (Interface) for AI services.
 */
public interface AIService {
    
    ProductAnalysis analyzeProduct(Map<String, Object> productData);
    
    SearchEnhancement enhanceSearch(String query);
    
    ProductComparison compareProducts(List<Map<String, Object>> products);
    
    boolean isAvailable();
    
    String getProviderName();
}