package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.ProductRepository;
import java.util.List;

/**
 * Use Case: Get all products
 */
public class GetAllProductsUseCase {
    
    private final ProductRepository productRepository;
    
    public GetAllProductsUseCase(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> execute() {
        return productRepository.findAll();
    }
}