package com.hackerrank.sample.domain.valueobject;

import java.util.Objects;

/**
 * Value Object: Rating
 * 
 * Encapsulates rating with validation (0-5 scale).
 * Immutable and self-validating.
 */
public class Rating {
    
    private static final double MIN_RATING = 0.0;
    private static final double MAX_RATING = 5.0;
    
    private final Double value;
    
    private Rating(Double value) {
        this.value = value;
    }
    
    public static Rating of(Double value) {
        validate(value);
        return new Rating(value);
    }
    
    public static Rating zero() {
        return new Rating(0.0);
    }
    
    public static Rating max() {
        return new Rating(MAX_RATING);
    }
    
    private static void validate(Double value) {
        if (value == null) {
            throw new IllegalArgumentException("Rating cannot be null");
        }
        if (value < MIN_RATING || value > MAX_RATING) {
            throw new IllegalArgumentException(
                String.format("Rating must be between %.1f and %.1f", MIN_RATING, MAX_RATING)
            );
        }
    }
    
    public boolean isHighRating() {
        return value >= 4.0;
    }
    
    public boolean isLowRating() {
        return value < 3.0;
    }
    
    public Double getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rating rating = (Rating) o;
        return Objects.equals(value, rating.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return String.format("%.1f/5.0", value);
    }
}