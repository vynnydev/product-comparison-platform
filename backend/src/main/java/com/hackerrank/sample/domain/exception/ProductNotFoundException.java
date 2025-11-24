package com.hackerrank.sample.domain.exception;

/**
 * Thrown when a product is not found in the system.
 */
public class ProductNotFoundException extends DomainException {
    
    public ProductNotFoundException(Long id) {
        super("Product with ID " + id + " not found");
    }
    
    public ProductNotFoundException(String message) {
        super(message);
    }
}