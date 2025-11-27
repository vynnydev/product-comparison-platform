package com.hackerrank.sample.ai.domain.model;  // ✅ CORRETO

import java.util.List;
import java.util.Map;

public class SearchEnhancement {
    
    private String originalQuery;
    private String enhancedQuery;
    private Map<String, Object> suggestedFilters;
    private List<String> synonyms;
    private SearchIntent intent;
    private Double confidence;
    
    public enum SearchIntent {
        BUDGET_PURCHASE,
        PREMIUM_PURCHASE,
        RESEARCH,
        COMPARISON,
        SPECIFIC_PRODUCT,
        CATEGORY_BROWSE,
        UNKNOWN
    }
    
    public SearchEnhancement() {}
    
    // Getters and Setters
    public String getOriginalQuery() { return originalQuery; }
    public void setOriginalQuery(String originalQuery) { 
        this.originalQuery = originalQuery; 
    }
    
    public String getEnhancedQuery() { return enhancedQuery; }
    public void setEnhancedQuery(String enhancedQuery) { 
        this.enhancedQuery = enhancedQuery; 
    }
    
    public Map<String, Object> getSuggestedFilters() { return suggestedFilters; }
    public void setSuggestedFilters(Map<String, Object> suggestedFilters) { 
        this.suggestedFilters = suggestedFilters; 
    }
    
    public List<String> getSynonyms() { return synonyms; }
    public void setSynonyms(List<String> synonyms) { this.synonyms = synonyms; }
    
    public SearchIntent getIntent() { return intent; }
    public void setIntent(SearchIntent intent) { this.intent = intent; }
    
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) {
        if (confidence != null && (confidence < 0 || confidence > 1)) {
            throw new IllegalArgumentException("Confidence must be between 0 and 1");
        }
        this.confidence = confidence;
    }
}