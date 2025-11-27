package com.hackerrank.sample.adapter.output.persistence;

import com.hackerrank.sample.adapter.output.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA Repository.
 * 
 * This is a framework-specific interface (Infrastructure layer).
 * It will be used by our ProductRepositoryAdapter.
 */
@Repository
public interface ProductJpaRepository extends JpaRepository<ProductEntity, Long> {
    
    List<ProductEntity> findByCategory(String category);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<ProductEntity> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                         @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.rating >= :minRating ORDER BY p.rating DESC")
    List<ProductEntity> findByMinimumRating(@Param("minRating") Double minRating);
    
    List<ProductEntity> findByNameContainingIgnoreCase(String keyword);
    
    boolean existsByName(String name);
}