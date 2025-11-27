package com.hackerrank.sample.domain.exception;

/**
 * Thrown when product data is invalid.
 */
public class InvalidProductException extends DomainException {
    
    public InvalidProductException(String message) {
        super(message);
    }
}