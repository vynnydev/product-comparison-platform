package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.IProductRepository;
import com.hackerrank.sample.domain.exception.DuplicateProductException;
import com.hackerrank.sample.domain.exception.InvalidProductException;

/**
 * Use Case: Create a new product
 * 
 * Application Business Rule:
 * - Validate product data
 * - Check for duplicates
 * - Save product
 */
public class CreateProductUseCase {
    
    private final IProductRepository productRepository;
    
    public CreateProductUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Product execute(Product product) {
        // Business rule: Validate product
        try {
            product.validateForCreation();
        } catch (IllegalArgumentException e) {
            throw new InvalidProductException(e.getMessage());
        }
        
        // Business rule: Check for duplicates
        if (product.getName() != null && productRepository.existsByName(product.getName().getValue())) {
            throw new DuplicateProductException(product.getName().getValue());
        }
        
        if (product.getId() != null && productRepository.existsById(product.getId())) {
            throw new DuplicateProductException(product.getId());
        }
        
        // Save and return
        return productRepository.save(product);
    }
}