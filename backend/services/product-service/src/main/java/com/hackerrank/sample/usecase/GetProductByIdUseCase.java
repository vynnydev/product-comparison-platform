package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.ProductRepository;
import com.hackerrank.sample.domain.exception.ProductNotFoundException;

/**
 * Use Case: Get a product by its ID
 */
public class GetProductByIdUseCase {
    
    private final ProductRepository productRepository;
    
    public GetProductByIdUseCase(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Product execute(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}