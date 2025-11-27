package com.hackerrank.sample.ai.domain.model;  // ✅ CORRETO

import java.time.LocalDateTime;
import java.util.List;

public class ProductAnalysis {
    
    private Long productId;
    private String productName;
    private String summary;
    private List<String> pros;
    private List<String> cons;
    private String targetAudience;
    private Double valueScore;
    private List<String> recommendedFor;
    private String aiModel;
    private LocalDateTime analyzedAt;
    
    public ProductAnalysis() {
        this.analyzedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public List<String> getPros() { return pros; }
    public void setPros(List<String> pros) { this.pros = pros; }
    
    public List<String> getCons() { return cons; }
    public void setCons(List<String> cons) { this.cons = cons; }
    
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { 
        this.targetAudience = targetAudience; 
    }
    
    public Double getValueScore() { return valueScore; }
    public void setValueScore(Double valueScore) { 
        if (valueScore != null && (valueScore < 0 || valueScore > 10)) {
            throw new IllegalArgumentException("Value score must be between 0 and 10");
        }
        this.valueScore = valueScore; 
    }
    
    public List<String> getRecommendedFor() { return recommendedFor; }
    public void setRecommendedFor(List<String> recommendedFor) { 
        this.recommendedFor = recommendedFor; 
    }
    
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { 
        this.analyzedAt = analyzedAt; 
    }
}