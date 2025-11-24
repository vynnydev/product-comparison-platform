package com.hackerrank.sample.domain.repository;

import com.hackerrank.sample.domain.model.Product;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Domain Repository Interface (Port)
 * 
 * This is a port in the hexagonal architecture terminology.
 * It defines what the domain needs from the outside world.
 * The implementation will be in the adapter layer.
 */
public interface IProductRepository {
    
    Product save(Product product);
    
    Optional<Product> findById(Long id);
    
    List<Product> findAll();
    
    List<Product> findByCategory(String category);
    
    List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Product> findByMinimumRating(Double minRating);
    
    List<Product> searchByName(String keyword);
    
    boolean existsById(Long id);
    
    boolean existsByName(String name);
    
    void deleteById(Long id);
    
    void deleteAll();
}