package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.IProductRepository;
import java.util.List;

/**
 * Use Case: Get all products
 */
public class GetAllProductsUseCase {
    
    private final IProductRepository productRepository;
    
    public GetAllProductsUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> execute() {
        return productRepository.findAll();
    }
}