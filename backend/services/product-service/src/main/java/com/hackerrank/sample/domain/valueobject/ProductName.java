package com.hackerrank.sample.domain.valueobject;

import java.util.Objects;

/**
 * Value Object: Product Name
 * 
 * Encapsulates product name with validation rules.
 */
public class ProductName {
    
    private static final int MIN_LENGTH = 3;
    private static final int MAX_LENGTH = 255;
    
    private final String value;
    
    private ProductName(String value) {
        this.value = value;
    }
    
    public static ProductName of(String value) {
        validate(value);
        return new ProductName(value.trim());
    }
    
    private static void validate(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        
        String trimmed = value.trim();
        if (trimmed.length() < MIN_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Product name must be at least %d characters", MIN_LENGTH)
            );
        }
        if (trimmed.length() > MAX_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Product name cannot exceed %d characters", MAX_LENGTH)
            );
        }
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductName that = (ProductName) o;
        return value.equalsIgnoreCase(that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value.toLowerCase());
    }
    
    @Override
    public String toString() {
        return value;
    }
}