package com.hackerrank.sample.usecase;

import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.IProductRepository;
import com.hackerrank.sample.domain.exception.ProductNotFoundException;
import com.hackerrank.sample.domain.exception.DuplicateProductException;

/**
 * Use Case: Update an existing product
 */
public class UpdateProductUseCase {
    
    private final IProductRepository productRepository;
    
    public UpdateProductUseCase(IProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Product execute(Long id, Product updatedData) {
        // Get existing product
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        // Update fields if provided
        if (updatedData.getName() != null) {
            // Check if name is being changed to an existing name
            if (!existingProduct.getName().getValue().equals(updatedData.getName().getValue()) 
                && productRepository.existsByName(updatedData.getName().getValue())) {
                throw new DuplicateProductException(updatedData.getName().getValue());
            }
            existingProduct.setName(updatedData.getName());
        }
        
        if (updatedData.getDescription() != null) {
            existingProduct.setDescription(updatedData.getDescription());
        }
        
        if (updatedData.getImageUrl() != null) {
            existingProduct.setImageUrl(updatedData.getImageUrl());
        }
        
        if (updatedData.getPrice() != null) {
            existingProduct.updatePrice(updatedData.getPrice());
        }
        
        if (updatedData.getRating() != null) {
            existingProduct.updateRating(updatedData.getRating());
        }
        
        if (updatedData.getCategory() != null) {
            existingProduct.setCategory(updatedData.getCategory());
        }
        
        if (updatedData.getInStock() != null) {
            existingProduct.setInStock(updatedData.getInStock());
        }
        
        if (updatedData.getSpecifications() != null && !updatedData.getSpecifications().isEmpty()) {
            existingProduct.setSpecifications(updatedData.getSpecifications());
        }
        
        return productRepository.save(existingProduct);
    }
}