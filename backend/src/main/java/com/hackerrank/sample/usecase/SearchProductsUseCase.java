package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.IProductRepository;
import com.hackerrank.sample.domain.exception.InvalidProductException;
import java.math.BigDecimal;
import java.util.List;

/**
 * Use Case: Search and filter products
 */
public class SearchProductsUseCase {
    
    private final IProductRepository productRepository;
    
    public SearchProductsUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> byCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public List<Product> byPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice.compareTo(maxPrice) > 0) {
            throw new InvalidProductException("Min price cannot be greater than max price");
        }
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    public List<Product> byMinimumRating(Double minRating) {
        if (minRating < 0 || minRating > 5) {
            throw new InvalidProductException("Rating must be between 0 and 5");
        }
        return productRepository.findByMinimumRating(minRating);
    }
    
    public List<Product> byName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new InvalidProductException("Search keyword cannot be empty");
        }
        return productRepository.searchByName(keyword);
    }
}