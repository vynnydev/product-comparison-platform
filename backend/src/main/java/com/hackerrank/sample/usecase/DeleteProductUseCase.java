package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.repository.IProductRepository;
import com.hackerrank.sample.domain.exception.ProductNotFoundException;

/**
 * Use Case: Delete a product by ID
 */
public class DeleteProductUseCase {
    
    private final IProductRepository productRepository;
    
    public DeleteProductUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public void execute(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }
}