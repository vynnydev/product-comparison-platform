package com.hackerrank.sample.usecase;

import com.hackerrank.sample.adapter.output.messaging.ProductEventPublisher;
import com.hackerrank.sample.domain.exception.*;
import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UpdateProductUseCase {
    
    private final ProductRepository productRepository;
    private final ProductEventPublisher eventPublisher;
    
    @Autowired
    public UpdateProductUseCase(
            ProductRepository productRepository,
            ProductEventPublisher eventPublisher) {
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }
    
    public Product execute(Long id, Product updatedData) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        if (updatedData.getName() != null && 
            !updatedData.getName().getValue().equals(existingProduct.getName().getValue()) &&
            productRepository.existsByName(updatedData.getName().getValue())) {
            throw new DuplicateProductException(updatedData.getName().getValue());
        }
        
        existingProduct.update(updatedData);
        
        Product savedProduct = productRepository.save(existingProduct);
        
        // Publish event
        eventPublisher.publishProductUpdated(savedProduct);
        
        return savedProduct;
    }
}