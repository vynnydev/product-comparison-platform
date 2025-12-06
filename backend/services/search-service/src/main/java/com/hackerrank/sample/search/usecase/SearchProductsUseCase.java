package com.hackerrank.sample.search.usecase;

import com.hackerrank.sample.search.adapter.output.persistence.SearchIndexRepository;
import com.hackerrank.sample.search.domain.model.SearchableProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Use case for searching products.
 * 
 * Provides various search capabilities:
 * - Full-text search
 * - Category browsing
 * - Filtered search
 * - AI-enhanced search
 * - Recommendations
 */
@Service
@Transactional(readOnly = true)
public class SearchProductsUseCase {
    
    private static final Logger logger = LoggerFactory.getLogger(SearchProductsUseCase.class);
    
    private final SearchIndexRepository repository;
    
    @Autowired
    public SearchProductsUseCase(SearchIndexRepository repository) {
        this.repository = repository;
    }
    
    /**
     * Simple keyword search
     */
    public Page<SearchableProduct> search(String query, int page, int size) {
        logger.info("Searching for: {}", query);
        Pageable pageable = PageRequest.of(page, size);
        return repository.searchByKeywords(query, pageable);
    }
    
    /**
     * Full-text search across name, description, and AI keywords
     */
    public Page<SearchableProduct> fullTextSearch(String query, int page, int size) {
        logger.info("Full-text search for: {}", query);
        Pageable pageable = PageRequest.of(page, size);
        return repository.fullTextSearch(query, pageable);
    }
    
    /**
     * Search with multiple filters
     */
    public Page<SearchableProduct> searchWithFilters(SearchFilters filters, int page, int size) {
        logger.info("Searching with filters: {}", filters);
        Pageable pageable = PageRequest.of(page, size);
        
        if (filters.getQuery() != null && !filters.getQuery().isBlank()) {
            return repository.searchWithQueryAndFilters(
                    filters.getQuery(),
                    filters.getCategory(),
                    filters.getMinPrice(),
                    filters.getMaxPrice(),
                    filters.getMinRating(),
                    filters.getInStock(),
                    pageable
            );
        }
        
        return repository.searchWithFilters(
                filters.getCategory(),
                filters.getMinPrice(),
                filters.getMaxPrice(),
                filters.getMinRating(),
                filters.getInStock(),
                pageable
        );
    }
    
    /**
     * Browse by category
     */
    public Page<SearchableProduct> browseByCategory(String category, int page, int size) {
        logger.info("Browsing category: {}", category);
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByCategoryIgnoreCaseOrderBySearchScoreDesc(category, pageable);
    }
    
    /**
     * Get all available categories
     */
    public List<String> getAllCategories() {
        return repository.findAllCategories();
    }
    
    /**
     * Search by AI-generated keywords
     */
    public Page<SearchableProduct> searchByAiKeywords(String keyword, int page, int size) {
        logger.info("Searching by AI keyword: {}", keyword);
        Pageable pageable = PageRequest.of(page, size);
        return repository.searchByAiKeywords(keyword, pageable);
    }
    
    /**
     * Find products by sentiment
     */
    public Page<SearchableProduct> findBySentiment(String sentiment, int page, int size) {
        logger.info("Finding products with sentiment: {}", sentiment);
        Pageable pageable = PageRequest.of(page, size);
        return repository.findBySentiment(sentiment, pageable);
    }
    
    /**
     * Get similar products (recommendations)
     */
    public List<SearchableProduct> getSimilarProducts(Long productId, int limit) {
        logger.info("Getting similar products for: {}", productId);
        
        Optional<SearchableProduct> productOpt = repository.findById(productId);
        if (productOpt.isEmpty()) {
            return List.of();
        }
        
        SearchableProduct product = productOpt.get();
        Pageable pageable = PageRequest.of(0, limit);
        return repository.findSimilarProducts(productId, product.getCategory(), pageable);
    }
    
    /**
     * Get top-rated products with AI analysis
     */
    public Page<SearchableProduct> getTopRated(int page, int size) {
        logger.info("Getting top-rated products");
        Pageable pageable = PageRequest.of(page, size);
        return repository.findTopRatedWithAnalysis(pageable);
    }
    
    /**
     * Get product by ID
     */
    public Optional<SearchableProduct> getById(Long id) {
        return repository.findById(id);
    }
    
    /**
     * Get search statistics
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", repository.count());
        stats.put("analyzedProducts", repository.countAnalyzedProducts());
        stats.put("pendingAnalysis", repository.countPendingAnalysis());
        stats.put("averageSearchScore", repository.getAverageSearchScore());
        stats.put("categories", repository.findAllCategories());
        return stats;
    }
    
    // ============================================
    // INNER CLASS: Search Filters
    // ============================================
    
    public static class SearchFilters {
        private String query;
        private String category;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private BigDecimal minRating;
        private Boolean inStock;
        
        // Getters and Setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public BigDecimal getMinPrice() { return minPrice; }
        public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
        
        public BigDecimal getMaxPrice() { return maxPrice; }
        public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
        
        public BigDecimal getMinRating() { return minRating; }
        public void setMinRating(BigDecimal minRating) { this.minRating = minRating; }
        
        public Boolean getInStock() { return inStock; }
        public void setInStock(Boolean inStock) { this.inStock = inStock; }
        
        @Override
        public String toString() {
            return "SearchFilters{" +
                    "query='" + query + '\'' +
                    ", category='" + category + '\'' +
                    ", minPrice=" + minPrice +
                    ", maxPrice=" + maxPrice +
                    ", minRating=" + minRating +
                    ", inStock=" + inStock +
                    '}';
        }
    }
}