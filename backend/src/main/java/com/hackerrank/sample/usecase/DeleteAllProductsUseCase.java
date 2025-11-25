package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.repository.IProductRepository;

/**
 * Use Case: Delete all products
 */
public class DeleteAllProductsUseCase {
    
    private final IProductRepository productRepository;
    
    public DeleteAllProductsUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public void execute() {
        productRepository.deleteAll();
    }
}