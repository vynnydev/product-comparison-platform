package com.hackerrank.sample.search.adapter.output.cache;

import com.hackerrank.sample.search.domain.model.SearchableProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Cache Service for Products using Redis
 */
@Service
public class ProductCacheService {

    private static final Logger logger = LoggerFactory.getLogger(ProductCacheService.class);

    private static final String PRODUCT_KEY_PREFIX = "product:";
    private static final String SEARCH_KEY_PREFIX = "search:";
    private static final String CATEGORY_KEY_PREFIX = "category:";
    private static final String TOP_RATED_KEY = "top:rated";
    
    private static final long PRODUCT_TTL_MINUTES = 30;
    private static final long SEARCH_TTL_MINUTES = 5;
    private static final long CATEGORY_TTL_MINUTES = 60;

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public ProductCacheService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // ========================================
    // PRODUCT CACHING
    // ========================================

    public void cacheProduct(SearchableProduct product) {
        String key = PRODUCT_KEY_PREFIX + product.getId();
        try {
            redisTemplate.opsForValue().set(key, product, PRODUCT_TTL_MINUTES, TimeUnit.MINUTES);
            logger.debug("Cached product: {}", product.getId());
        } catch (Exception e) {
            logger.warn("Failed to cache product {}: {}", product.getId(), e.getMessage());
        }
    }

    public Optional<SearchableProduct> getProduct(Long productId) {
        String key = PRODUCT_KEY_PREFIX + productId;
        try {
            Object cached = redisTemplate.opsForValue().get(key);
            if (cached instanceof SearchableProduct) {
                logger.debug("Cache HIT for product: {}", productId);
                return Optional.of((SearchableProduct) cached);
            }
        } catch (Exception e) {
            logger.warn("Failed to get product from cache: {}", e.getMessage());
        }
        return Optional.empty();
    }

    public void evictProduct(Long productId) {
        String key = PRODUCT_KEY_PREFIX + productId;
        try {
            redisTemplate.delete(key);
            logger.debug("Evicted product: {}", productId);
        } catch (Exception e) {
            logger.warn("Failed to evict product: {}", e.getMessage());
        }
    }

    // ========================================
    // SEARCH RESULTS CACHING
    // ========================================

    private String generateSearchKey(String query, String filters) {
        String combined = query + ":" + (filters != null ? filters : "");
        return SEARCH_KEY_PREFIX + combined.hashCode();
    }

    @SuppressWarnings("unchecked")
    public void cacheSearchResults(String query, String filters, List<SearchableProduct> results) {
        String key = generateSearchKey(query, filters);
        try {
            redisTemplate.opsForValue().set(key, results, SEARCH_TTL_MINUTES, TimeUnit.MINUTES);
            logger.debug("Cached search results for: {}", query);
        } catch (Exception e) {
            logger.warn("Failed to cache search: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public Optional<List<SearchableProduct>> getSearchResults(String query, String filters) {
        String key = generateSearchKey(query, filters);
        try {
            Object cached = redisTemplate.opsForValue().get(key);
            if (cached instanceof List) {
                logger.debug("Cache HIT for search: {}", query);
                return Optional.of((List<SearchableProduct>) cached);
            }
        } catch (Exception e) {
            logger.warn("Failed to get search from cache: {}", e.getMessage());
        }
        return Optional.empty();
    }

    // ========================================
    // CATEGORY CACHING
    // ========================================

    @SuppressWarnings("unchecked")
    public void cacheCategoryProducts(String category, List<SearchableProduct> products) {
        String key = CATEGORY_KEY_PREFIX + category.toLowerCase();
        try {
            redisTemplate.opsForValue().set(key, products, CATEGORY_TTL_MINUTES, TimeUnit.MINUTES);
        } catch (Exception e) {
            logger.warn("Failed to cache category: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public Optional<List<SearchableProduct>> getCategoryProducts(String category) {
        String key = CATEGORY_KEY_PREFIX + category.toLowerCase();
        try {
            Object cached = redisTemplate.opsForValue().get(key);
            if (cached instanceof List) {
                return Optional.of((List<SearchableProduct>) cached);
            }
        } catch (Exception e) {
            logger.warn("Failed to get category from cache: {}", e.getMessage());
        }
        return Optional.empty();
    }

    // ========================================
    // TOP RATED CACHING
    // ========================================

    public void cacheTopRated(List<SearchableProduct> products) {
        try {
            redisTemplate.opsForValue().set(TOP_RATED_KEY, products, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            logger.warn("Failed to cache top rated: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public Optional<List<SearchableProduct>> getTopRated() {
        try {
            Object cached = redisTemplate.opsForValue().get(TOP_RATED_KEY);
            if (cached instanceof List) {
                return Optional.of((List<SearchableProduct>) cached);
            }
        } catch (Exception e) {
            logger.warn("Failed to get top rated: {}", e.getMessage());
        }
        return Optional.empty();
    }

    // ========================================
    // CACHE MANAGEMENT
    // ========================================

    public void clearAllCaches() {
        try {
            Set<String> keys = redisTemplate.keys("*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
            logger.info("Cleared all caches");
        } catch (Exception e) {
            logger.error("Failed to clear caches: {}", e.getMessage());
        }
    }

    public void invalidateSearchCaches() {
        try {
            Set<String> searchKeys = redisTemplate.keys(SEARCH_KEY_PREFIX + "*");
            if (searchKeys != null && !searchKeys.isEmpty()) {
                redisTemplate.delete(searchKeys);
                logger.info("Invalidated {} search caches", searchKeys.size());
            }
        } catch (Exception e) {
            logger.warn("Failed to invalidate search caches: {}", e.getMessage());
        }
    }

    public CacheStats getStats() {
        try {
            Set<String> productKeys = redisTemplate.keys(PRODUCT_KEY_PREFIX + "*");
            Set<String> searchKeys = redisTemplate.keys(SEARCH_KEY_PREFIX + "*");
            Set<String> categoryKeys = redisTemplate.keys(CATEGORY_KEY_PREFIX + "*");

            return new CacheStats(
                    productKeys != null ? productKeys.size() : 0,
                    searchKeys != null ? searchKeys.size() : 0,
                    categoryKeys != null ? categoryKeys.size() : 0
            );
        } catch (Exception e) {
            return new CacheStats(0, 0, 0);
        }
    }

    public record CacheStats(int products, int searches, int categories) {}
}