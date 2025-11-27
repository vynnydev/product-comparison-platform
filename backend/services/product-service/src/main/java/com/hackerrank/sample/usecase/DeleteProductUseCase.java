package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.repository.ProductRepository;
import com.hackerrank.sample.domain.exception.ProductNotFoundException;

/**
 * Use Case: Delete a product by ID
 */
public class DeleteProductUseCase {
    
    private final ProductRepository productRepository;
    
    public DeleteProductUseCase(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public void execute(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }
}