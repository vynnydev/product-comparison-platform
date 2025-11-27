package com.hackerrank.sample.ai.adapter.output.ai;

import com.hackerrank.sample.ai.domain.model.*;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
@Profile({"local", "docker"})  // ✅ ADICIONE ESTA LINHA
public class MockAIAdapter implements AIService {
    
    @Override
    public ProductAnalysis analyzeProduct(Map<String, Object> productData) {
        ProductAnalysis analysis = new ProductAnalysis();
        analysis.setProductId(((Number) productData.get("id")).longValue());
        analysis.setProductName((String) productData.get("name"));
        analysis.setSummary("Mock analysis: This is a simulated product analysis for development purposes.");
        analysis.setPros(Arrays.asList("Feature 1", "Feature 2", "Good value"));
        analysis.setCons(Arrays.asList("Limitation 1", "Could improve X"));
        analysis.setTargetAudience("General consumers looking for quality products");
        analysis.setValueScore(8.5);
        analysis.setRecommendedFor(Arrays.asList("Budget-conscious buyers", "First-time users"));
        analysis.setAiModel("Mock AI Provider (Local Development)");
        analysis.setAnalyzedAt(LocalDateTime.now());
        return analysis;
    }
    
    @Override
    public SearchEnhancement enhanceSearch(String query) {
        SearchEnhancement enhancement = new SearchEnhancement();
        enhancement.setOriginalQuery(query);
        enhancement.setEnhancedQuery(query + " (enhanced)");
        enhancement.setIntent(SearchEnhancement.SearchIntent.RESEARCH);
        enhancement.setConfidence(0.85);
        enhancement.setSynonyms(Arrays.asList(query, query + " alternative"));
        
        Map<String, Object> filters = new HashMap<>();
        filters.put("priceRange", "100-500");
        filters.put("minRating", 4.0);
        enhancement.setSuggestedFilters(filters);
        
        return enhancement;
    }
    
    @Override
    public ProductComparison compareProducts(List<Map<String, Object>> products) {
        ProductComparison comparison = new ProductComparison();
        
        List<Long> productIds = products.stream()
            .map(p -> ((Number) p.get("id")).longValue())
            .toList();
        
        comparison.setProductIds(productIds);
        comparison.setWinnerProductId(productIds.get(0));
        comparison.setReasoning("Mock comparison: First product selected as winner for development testing.");
        
        Map<String, ProductComparison.ComparisonDimension> breakdown = new HashMap<>();
        breakdown.put("performance", new ProductComparison.ComparisonDimension(
            productIds.get(0), 8.5, "Better performance metrics"
        ));
        breakdown.put("price", new ProductComparison.ComparisonDimension(
            productIds.get(0), 7.0, "Competitive pricing"
        ));
        comparison.setBreakdown(breakdown);
        
        return comparison;
    }
    
    @Override
    public boolean isAvailable() {
        return true;
    }
    
    @Override
    public String getProviderName() {
        return "Mock AI Provider (Local Development)";
    }
}