package com.hackerrank.sample.usecase;

import com.hackerrank.sample.adapter.output.messaging.ProductEventPublisher;
import com.hackerrank.sample.domain.exception.*;
import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateProductUseCase {
    
    private final ProductRepository productRepository;
    private final ProductEventPublisher eventPublisher;
    
    @Autowired
    public CreateProductUseCase(
            ProductRepository productRepository,
            ProductEventPublisher eventPublisher) {
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }
    
    public Product execute(Product product) {
        try {
            product.validateForCreation();
        } catch (IllegalArgumentException e) {
            throw new InvalidProductException(e.getMessage());
        }
        
        if (product.getName() != null && 
            productRepository.existsByName(product.getName().getValue())) {
            throw new DuplicateProductException(product.getName().getValue());
        }
        
        if (product.getId() != null && productRepository.existsById(product.getId())) {
            throw new DuplicateProductException(product.getId());
        }
        
        Product savedProduct = productRepository.save(product);
        
        // Publish event
        eventPublisher.publishProductCreated(savedProduct);
        
        return savedProduct;
    }
}