package com.hackerrank.sample.search.adapter.input.rest;

import com.hackerrank.sample.search.domain.model.SearchableProduct;
import com.hackerrank.sample.search.usecase.SearchProductsUseCase;
import com.hackerrank.sample.search.usecase.SearchProductsUseCase.SearchFilters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Search Operations
 */
@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {
    
    private final SearchProductsUseCase searchProductsUseCase;

    @Autowired
    private ProductCacheService cacheService;

    @Autowired
    private OpenSearchIndexService openSearchService;
    
    @Autowired
    public SearchController(SearchProductsUseCase searchProductsUseCase) {
        this.searchProductsUseCase = searchProductsUseCase;
    }
    
    // ============================================
    // BASIC SEARCH
    // ============================================
    
    /**
     * Simple keyword search
     * GET /api/search?q=iphone&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<SearchableProduct>> search(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.search(query, page, size);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Full-text search
     * GET /api/search/full?q=smartphone&page=0&size=20
     */
    @GetMapping("/full")
    public ResponseEntity<Page<SearchableProduct>> fullTextSearch(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.fullTextSearch(query, page, size);
        return ResponseEntity.ok(results);
    }
    
    // ============================================
    // FILTERED SEARCH
    // ============================================
    
    /**
     * Advanced search with filters
     * POST /api/search/filter
     * Body: { "query": "phone", "category": "Electronics", "minPrice": 100, "maxPrice": 1000 }
     */
    @PostMapping("/filter")
    public ResponseEntity<Page<SearchableProduct>> searchWithFilters(
            @RequestBody SearchFilters filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.searchWithFilters(filters, page, size);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Search with query parameters
     * GET /api/search/advanced?q=phone&category=Electronics&minPrice=100&maxPrice=1000&minRating=4&inStock=true
     */
    @GetMapping("/advanced")
    public ResponseEntity<Page<SearchableProduct>> advancedSearch(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        SearchFilters filters = new SearchFilters();
        filters.setQuery(q);
        filters.setCategory(category);
        filters.setMinPrice(minPrice);
        filters.setMaxPrice(maxPrice);
        filters.setMinRating(minRating);
        filters.setInStock(inStock);
        
        Page<SearchableProduct> results = searchProductsUseCase.searchWithFilters(filters, page, size);
        return ResponseEntity.ok(results);
    }
    
    // ============================================
    // CATEGORY BROWSING
    // ============================================
    
    /**
     * Browse products by category
     * GET /api/search/category/Electronics?page=0&size=20
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<SearchableProduct>> browseCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.browseByCategory(category, page, size);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Get all available categories
     * GET /api/search/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = searchProductsUseCase.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    // ============================================
    // AI-ENHANCED SEARCH
    // ============================================
    
    /**
     * Search by AI-generated keywords
     * GET /api/search/ai/keywords?k=premium&page=0&size=20
     */
    @GetMapping("/ai/keywords")
    public ResponseEntity<Page<SearchableProduct>> searchByAiKeywords(
            @RequestParam("k") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.searchByAiKeywords(keyword, page, size);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Find products by sentiment
     * GET /api/search/ai/sentiment/positive?page=0&size=20
     */
    @GetMapping("/ai/sentiment/{sentiment}")
    public ResponseEntity<Page<SearchableProduct>> findBySentiment(
            @PathVariable String sentiment,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.findBySentiment(sentiment, page, size);
        return ResponseEntity.ok(results);
    }
    
    // ============================================
    // RECOMMENDATIONS
    // ============================================
    
    /**
     * Get similar products
     * GET /api/search/similar/123?limit=5
     */
    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<SearchableProduct>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<SearchableProduct> similar = searchProductsUseCase.getSimilarProducts(productId, limit);
        return ResponseEntity.ok(similar);
    }
    
    /**
     * Get top-rated products with AI analysis
     * GET /api/search/top-rated?page=0&size=10
     */
    @GetMapping("/top-rated")
    public ResponseEntity<Page<SearchableProduct>> getTopRated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<SearchableProduct> results = searchProductsUseCase.getTopRated(page, size);
        return ResponseEntity.ok(results);
    }
    
    // ============================================
    // PRODUCT DETAILS
    // ============================================
    
    /**
     * Get product by ID
     * GET /api/search/products/123
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<SearchableProduct> getProduct(@PathVariable Long id) {
        return searchProductsUseCase.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // ============================================
    // STATISTICS
    // ============================================
    
    /**
     * Get search statistics
     * GET /api/search/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = searchProductsUseCase.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    // ============================================
    // HEALTH CHECK
    // ============================================
    
    /**
     * Health check endpoint
     * GET /api/search/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "search-service"
        ));
    }

    /**
     * Full-text search using OpenSearch
     */
    @GetMapping("/opensearch")
    public ResponseEntity<List<SearchableProduct>> openSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int from,
            @RequestParam(defaultValue = "20") int size) {
        try {
            // Check cache first
            Optional<List<SearchableProduct>> cached = cacheService.getSearchResults(q, null);
            if (cached.isPresent()) {
                return ResponseEntity.ok(cached.get());
            }
            
            // Search in OpenSearch
            List<SearchableProduct> results = openSearchService.search(q, from, size);
            
            // Cache results
            cacheService.cacheSearchResults(q, null, results);
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Advanced search with filters using OpenSearch
     */
    @PostMapping("/opensearch/filter")
    public ResponseEntity<List<SearchableProduct>> openSearchWithFilters(
            @RequestBody SearchFilterRequest request) {
        try {
            List<SearchableProduct> results = openSearchService.searchWithFilters(
                    request.getQuery(),
                    request.getCategory(),
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    request.getMinRating(),
                    request.getInStock(),
                    request.getFrom() != null ? request.getFrom() : 0,
                    request.getSize() != null ? request.getSize() : 20
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Reindex all products in OpenSearch
     */
    @PostMapping("/opensearch/reindex")
    public ResponseEntity<Map<String, Object>> reindexAll() {
        try {
            List<SearchableProduct> allProducts = repository.findAll();
            openSearchService.bulkIndexProducts(allProducts);
            
            Map<String, Object> result = new HashMap<>();
            result.put("indexed", allProducts.size());
            result.put("status", "success");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get cache statistics
     */
    @GetMapping("/cache/stats")
    public ResponseEntity<ProductCacheService.CacheStats> getCacheStats() {
        return ResponseEntity.ok(cacheService.getStats());
    }

    /**
     * Clear all caches
     */
    @DeleteMapping("/cache")
    public ResponseEntity<Void> clearCache() {
        cacheService.clearAllCaches();
        return ResponseEntity.noContent().build();
    }

    /**
     * Get OpenSearch index statistics
     */
    @GetMapping("/opensearch/stats")
    public ResponseEntity<Map<String, Object>> getOpenSearchStats() {
        try {
            return ResponseEntity.ok(openSearchService.getIndexStats());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}