package com.hackerrank.sample.ai.domain.model;  // ✅ CORRETO

import java.util.List;
import java.util.Map;

public class ProductComparison {
    
    private List<Long> productIds;
    private Long winnerProductId;
    private String reasoning;
    private Map<String, ComparisonDimension> breakdown;
    
    public static class ComparisonDimension {
        private Long winnerProductId;
        private Double score;
        private String explanation;
        
        public ComparisonDimension() {}
        
        public ComparisonDimension(Long winnerProductId, Double score, String explanation) {
            this.winnerProductId = winnerProductId;
            this.score = score;
            this.explanation = explanation;
        }
        
        public Long getWinnerProductId() { return winnerProductId; }
        public void setWinnerProductId(Long winnerProductId) { 
            this.winnerProductId = winnerProductId; 
        }
        
        public Double getScore() { return score; }
        public void setScore(Double score) {
            if (score != null && (score < 0 || score > 10)) {
                throw new IllegalArgumentException("Score must be between 0 and 10");
            }
            this.score = score;
        }
        
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { 
            this.explanation = explanation; 
        }
    }
    
    public ProductComparison() {}
    
    public List<Long> getProductIds() { return productIds; }
    public void setProductIds(List<Long> productIds) { this.productIds = productIds; }
    
    public Long getWinnerProductId() { return winnerProductId; }
    public void setWinnerProductId(Long winnerProductId) { 
        this.winnerProductId = winnerProductId; 
    }
    
    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
    
    public Map<String, ComparisonDimension> getBreakdown() { return breakdown; }
    public void setBreakdown(Map<String, ComparisonDimension> breakdown) { 
        this.breakdown = breakdown; 
    }
}