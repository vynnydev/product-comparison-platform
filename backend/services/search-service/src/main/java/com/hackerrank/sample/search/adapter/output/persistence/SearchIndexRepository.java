package com.hackerrank.sample.search.adapter.output.persistence;

import com.hackerrank.sample.search.domain.model.SearchableProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for Search Index operations
 */
@Repository
public interface SearchIndexRepository extends JpaRepository<SearchableProduct, Long> {
    
    // ============================================
    // FULL TEXT SEARCH
    // ============================================
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "LOWER(p.searchKeywords) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY p.searchScore DESC")
    Page<SearchableProduct> searchByKeywords(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.aiKeywords) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY p.searchScore DESC")
    Page<SearchableProduct> fullTextSearch(@Param("query") String query, Pageable pageable);
    
    // ============================================
    // CATEGORY SEARCH
    // ============================================
    
    Page<SearchableProduct> findByCategoryIgnoreCaseOrderBySearchScoreDesc(
            String category, Pageable pageable);
    
    @Query("SELECT DISTINCT p.category FROM SearchableProduct p ORDER BY p.category")
    List<String> findAllCategories();
    
    // ============================================
    // FILTERS
    // ============================================
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:inStock IS NULL OR p.inStock = :inStock) " +
           "ORDER BY p.searchScore DESC")
    Page<SearchableProduct> searchWithFilters(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") BigDecimal minRating,
            @Param("inStock") Boolean inStock,
            Pageable pageable);
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "LOWER(p.searchKeywords) LIKE LOWER(CONCAT('%', :query, '%')) AND " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:inStock IS NULL OR p.inStock = :inStock) " +
           "ORDER BY p.searchScore DESC")
    Page<SearchableProduct> searchWithQueryAndFilters(
            @Param("query") String query,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") BigDecimal minRating,
            @Param("inStock") Boolean inStock,
            Pageable pageable);
    
    // ============================================
    // AI-ENRICHED SEARCH
    // ============================================
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "p.analysisCompleted = true AND " +
           "LOWER(p.aiKeywords) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY p.aiScore DESC, p.searchScore DESC")
    Page<SearchableProduct> searchByAiKeywords(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "p.analysisCompleted = true AND " +
           "LOWER(p.aiSentiment) = LOWER(:sentiment) " +
           "ORDER BY p.aiScore DESC")
    Page<SearchableProduct> findBySentiment(@Param("sentiment") String sentiment, Pageable pageable);
    
    // ============================================
    // RECOMMENDATIONS
    // ============================================
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "p.analysisCompleted = true AND " +
           "p.category = :category AND " +
           "p.id != :productId " +
           "ORDER BY p.aiScore DESC, p.searchScore DESC")
    List<SearchableProduct> findSimilarProducts(
            @Param("productId") Long productId, 
            @Param("category") String category, 
            Pageable pageable);
    
    @Query("SELECT p FROM SearchableProduct p WHERE " +
           "p.analysisCompleted = true AND " +
           "p.inStock = true " +
           "ORDER BY p.aiScore DESC, p.rating DESC")
    Page<SearchableProduct> findTopRatedWithAnalysis(Pageable pageable);
    
    // ============================================
    // STATISTICS
    // ============================================
    
    @Query("SELECT COUNT(p) FROM SearchableProduct p WHERE p.analysisCompleted = true")
    Long countAnalyzedProducts();
    
    @Query("SELECT COUNT(p) FROM SearchableProduct p WHERE p.analysisCompleted = false")
    Long countPendingAnalysis();
    
    @Query("SELECT AVG(p.searchScore) FROM SearchableProduct p")
    BigDecimal getAverageSearchScore();
}