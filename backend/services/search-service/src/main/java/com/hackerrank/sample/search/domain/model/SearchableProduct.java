package com.hackerrank.sample.search.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Searchable Product Entity
 * 
 * Represents a product indexed for search with AI analysis enrichment.
 */
@Entity
@Table(name = "searchable_products", indexes = {
    @Index(name = "idx_search_name", columnList = "name"),
    @Index(name = "idx_search_category", columnList = "category"),
    @Index(name = "idx_search_price", columnList = "price"),
    @Index(name = "idx_search_rating", columnList = "rating"),
    @Index(name = "idx_search_score", columnList = "searchScore")
})
public class SearchableProduct {
    
    @Id
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private String category;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
    
    @Column(nullable = false)
    private Boolean inStock;
    
    @Column(columnDefinition = "TEXT")
    private String specifications;
    
    // AI Analysis Fields
    @Column(columnDefinition = "TEXT")
    private String aiSummary;
    
    @Column(columnDefinition = "TEXT")
    private String aiKeywords;
    
    @Column(columnDefinition = "TEXT")
    private String aiSentiment;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal aiScore;
    
    @Column(columnDefinition = "TEXT")
    private String aiRecommendations;
    
    // Search optimization
    @Column(precision = 5, scale = 2)
    private BigDecimal searchScore;
    
    @Column(columnDefinition = "TEXT")
    private String searchKeywords;
    
    // Metadata
    @Column(nullable = false)
    private LocalDateTime indexedAt;
    
    private LocalDateTime analysisUpdatedAt;
    
    @Column(nullable = false)
    private Boolean analysisCompleted;
    
    @Version
    private Long version;
    
    // Constructors
    public SearchableProduct() {
        this.indexedAt = LocalDateTime.now();
        this.analysisCompleted = false;
        this.searchScore = BigDecimal.ZERO;
    }
    
    public SearchableProduct(Long id, String name, String description, BigDecimal price, 
                            String category, BigDecimal rating, Boolean inStock) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.rating = rating;
        this.inStock = inStock;
        this.searchKeywords = generateSearchKeywords();
    }
    
    // Business Methods
    public void enrichWithAnalysis(String summary, String keywords, String sentiment, 
                                   BigDecimal score, String recommendations) {
        this.aiSummary = summary;
        this.aiKeywords = keywords;
        this.aiSentiment = sentiment;
        this.aiScore = score;
        this.aiRecommendations = recommendations;
        this.analysisCompleted = true;
        this.analysisUpdatedAt = LocalDateTime.now();
        calculateSearchScore();
        updateSearchKeywords();
    }
    
    public void updateFromProduct(String name, String description, BigDecimal price,
                                  String category, BigDecimal rating, Boolean inStock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.rating = rating;
        this.inStock = inStock;
        this.indexedAt = LocalDateTime.now();
        this.analysisCompleted = false; // Reset, will be re-analyzed
        calculateSearchScore();
        updateSearchKeywords();
    }
    
    private void calculateSearchScore() {
        BigDecimal score = BigDecimal.ZERO;
        
        // Base score from rating (0-5 -> 0-50)
        if (rating != null) {
            score = score.add(rating.multiply(BigDecimal.TEN));
        }
        
        // AI score contribution (0-10 -> 0-30)
        if (aiScore != null) {
            score = score.add(aiScore.multiply(BigDecimal.valueOf(3)));
        }
        
        // In stock bonus (+20)
        if (Boolean.TRUE.equals(inStock)) {
            score = score.add(BigDecimal.valueOf(20));
        }
        
        this.searchScore = score;
    }
    
    private String generateSearchKeywords() {
        StringBuilder keywords = new StringBuilder();
        keywords.append(name != null ? name.toLowerCase() : "").append(" ");
        keywords.append(category != null ? category.toLowerCase() : "").append(" ");
        keywords.append(description != null ? description.toLowerCase() : "");
        return keywords.toString().trim();
    }
    
    private void updateSearchKeywords() {
        StringBuilder keywords = new StringBuilder(generateSearchKeywords());
        if (aiKeywords != null && !aiKeywords.isEmpty()) {
            keywords.append(" ").append(aiKeywords.toLowerCase());
        }
        this.searchKeywords = keywords.toString();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    
    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
    
    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }
    
    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }
    
    public String getAiKeywords() { return aiKeywords; }
    public void setAiKeywords(String aiKeywords) { this.aiKeywords = aiKeywords; }
    
    public String getAiSentiment() { return aiSentiment; }
    public void setAiSentiment(String aiSentiment) { this.aiSentiment = aiSentiment; }
    
    public BigDecimal getAiScore() { return aiScore; }
    public void setAiScore(BigDecimal aiScore) { this.aiScore = aiScore; }
    
    public String getAiRecommendations() { return aiRecommendations; }
    public void setAiRecommendations(String aiRecommendations) { this.aiRecommendations = aiRecommendations; }
    
    public BigDecimal getSearchScore() { return searchScore; }
    public void setSearchScore(BigDecimal searchScore) { this.searchScore = searchScore; }
    
    public String getSearchKeywords() { return searchKeywords; }
    public void setSearchKeywords(String searchKeywords) { this.searchKeywords = searchKeywords; }
    
    public LocalDateTime getIndexedAt() { return indexedAt; }
    public void setIndexedAt(LocalDateTime indexedAt) { this.indexedAt = indexedAt; }
    
    public LocalDateTime getAnalysisUpdatedAt() { return analysisUpdatedAt; }
    public void setAnalysisUpdatedAt(LocalDateTime analysisUpdatedAt) { this.analysisUpdatedAt = analysisUpdatedAt; }
    
    public Boolean getAnalysisCompleted() { return analysisCompleted; }
    public void setAnalysisCompleted(Boolean analysisCompleted) { this.analysisCompleted = analysisCompleted; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}