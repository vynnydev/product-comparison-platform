package com.hackerrank.sample.domain.exception;

/**
 * Thrown when trying to create a product that already exists.
 */
public class DuplicateProductException extends DomainException {
    
    public DuplicateProductException(String productName) {
        super("Product with name '" + productName + "' already exists");
    }
    
    public DuplicateProductException(Long id) {
        super("Product with ID " + id + " already exists");
    }
}