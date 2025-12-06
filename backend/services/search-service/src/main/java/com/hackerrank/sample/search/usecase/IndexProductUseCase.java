package com.hackerrank.sample.search.usecase;

import com.hackerrank.sample.search.adapter.output.persistence.SearchIndexRepository;
import com.hackerrank.sample.search.domain.model.SearchableProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Use case for indexing products in the search service.
 * 
 * Handles:
 * - Product created events (index new product)
 * - Product updated events (update existing index)
 * - Product deleted events (remove from index)
 * - Analysis completed events (enrich with AI data)
 */
@Service
public class IndexProductUseCase {
    
    private static final Logger logger = LoggerFactory.getLogger(IndexProductUseCase.class);
    
    private final SearchIndexRepository repository;
    
    @Autowired
    public IndexProductUseCase(SearchIndexRepository repository) {
        this.repository = repository;
    }
    
    /**
     * Index a new product or update existing
     */
    @Transactional
    public SearchableProduct indexProduct(Map<String, Object> productData) {
        Long productId = extractLong(productData.get("id"));
        
        if (productId == null) {
            logger.error("Product ID is required for indexing");
            throw new IllegalArgumentException("Product ID is required");
        }
        
        logger.info("Indexing product: {}", productId);
        
        Optional<SearchableProduct> existing = repository.findById(productId);
        
        SearchableProduct product;
        if (existing.isPresent()) {
            product = existing.get();
            updateProduct(product, productData);
            logger.info("Updated existing product in index: {}", productId);
        } else {
            product = createNewProduct(productData);
            logger.info("Created new product in index: {}", productId);
        }
        
        return repository.save(product);
    }
    
    /**
     * Update product with data changes
     */
    @Transactional
    public SearchableProduct updateProduct(Long productId, Map<String, Object> productData) {
        SearchableProduct product = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        
        updateProduct(product, productData);
        
        logger.info("Updated product in index: {}", productId);
        return repository.save(product);
    }
    
    /**
     * Remove product from index
     */
    @Transactional
    public void removeProduct(Long productId) {
        if (repository.existsById(productId)) {
            repository.deleteById(productId);
            logger.info("Removed product from index: {}", productId);
        } else {
            logger.warn("Product not found in index for removal: {}", productId);
        }
    }
    
    /**
     * Enrich product with AI analysis
     */
    @Transactional
    public SearchableProduct enrichWithAnalysis(Long productId, Map<String, Object> analysisData) {
        SearchableProduct product = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        
        String summary = extractString(analysisData.get("summary"));
        String keywords = extractString(analysisData.get("keywords"));
        String sentiment = extractString(analysisData.get("sentiment"));
        BigDecimal score = extractBigDecimal(analysisData.get("score"));
        String recommendations = extractString(analysisData.get("recommendations"));
        
        product.enrichWithAnalysis(summary, keywords, sentiment, score, recommendations);
        
        logger.info("Enriched product {} with AI analysis", productId);
        return repository.save(product);
    }
    
    // ============================================
    // PRIVATE HELPER METHODS
    // ============================================
    
    private SearchableProduct createNewProduct(Map<String, Object> data) {
        SearchableProduct product = new SearchableProduct();
        product.setId(extractLong(data.get("id")));
        product.setName(extractString(data.get("name")));
        product.setDescription(extractString(data.get("description")));
        product.setPrice(extractBigDecimal(data.get("price")));
        product.setCategory(extractString(data.get("category")));
        product.setRating(extractBigDecimal(data.get("rating")));
        product.setInStock(extractBoolean(data.get("inStock")));
        
        Object specs = data.get("specifications");
        if (specs != null) {
            product.setSpecifications(specs.toString());
        }
        
        return product;
    }
    
    private void updateProduct(SearchableProduct product, Map<String, Object> data) {
        product.updateFromProduct(
                extractString(data.get("name")),
                extractString(data.get("description")),
                extractBigDecimal(data.get("price")),
                extractString(data.get("category")),
                extractBigDecimal(data.get("rating")),
                extractBoolean(data.get("inStock"))
        );
        
        Object specs = data.get("specifications");
        if (specs != null) {
            product.setSpecifications(specs.toString());
        }
    }
    
    private Long extractLong(Object value) {
        if (value == null) return null;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof String) return Long.parseLong((String) value);
        return null;
    }
    
    private String extractString(Object value) {
        return value != null ? value.toString() : null;
    }
    
    private BigDecimal extractBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Double) return BigDecimal.valueOf((Double) value);
        if (value instanceof Integer) return BigDecimal.valueOf((Integer) value);
        if (value instanceof String) return new BigDecimal((String) value);
        return null;
    }
    
    private Boolean extractBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof String) return Boolean.parseBoolean((String) value);
        return null;
    }
}