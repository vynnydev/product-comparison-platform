package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.repository.ProductRepository;

/**
 * Use Case: Delete all products
 */
public class DeleteAllProductsUseCase {
    
    private final ProductRepository productRepository;
    
    public DeleteAllProductsUseCase(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public void execute() {
        productRepository.deleteAll();
    }
}