package com.hackerrank.sample.domain.model;

import com.hackerrank.sample.domain.valueobject.Money;
import com.hackerrank.sample.domain.valueobject.ProductName;
import com.hackerrank.sample.domain.valueobject.Rating;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Domain Entity - Product (REFACTORED with Value Objects)
 * 
 * Aggregate Root in DDD terminology.
 * Pure business logic entity without framework dependencies.
 */
public class Product {
    
    private Long id;
    private ProductName name;
    private String description;
    private String imageUrl;
    private Money price;
    private Rating rating;
    private String category;
    private Boolean inStock;
    private Map<String, String> specifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Public constructor for controlled creation
    public Product() {
        this.specifications = new HashMap<>();
        this.inStock = true;
        this.rating = Rating.zero();
    }

    // Factory method - preferred way to create products
    public static Product create(ProductName name, String description, String imageUrl,
                                 Money price, String category) {
        Product product = new Product();
        product.name = name;
        product.description = description;
        product.imageUrl = imageUrl;
        product.price = price;
        product.category = category;
        product.createdAt = LocalDateTime.now();
        product.updatedAt = LocalDateTime.now();
        return product;
    }

    // Business Rules (Domain Logic)
    
    public void validateForCreation() {
        if (name == null) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (price == null || price.isZero()) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL is required");
        }
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }
    }

    public void updatePrice(Money newPrice) {
        if (newPrice == null || newPrice.isZero()) {
            throw new IllegalArgumentException("Invalid price");
        }
        this.price = newPrice;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateRating(Rating newRating) {
        if (newRating == null) {
            throw new IllegalArgumentException("Rating cannot be null");
        }
        this.rating = newRating;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsOutOfStock() {
        this.inStock = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsInStock() {
        this.inStock = true;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isAvailable() {
        return this.inStock != null && this.inStock;
    }
    
    public boolean hasHighRating() {
        return this.rating != null && this.rating.isHighRating();
    }
    
    public void addSpecification(String key, String value) {
        this.specifications.put(key, value);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void removeSpecification(String key) {
        this.specifications.remove(key);
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public ProductName getName() { return name; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public Money getPrice() { return price; }
    public Rating getRating() { return rating; }
    public String getCategory() { return category; }
    public Boolean getInStock() { return inStock; }
    public Map<String, String> getSpecifications() { return new HashMap<>(specifications); }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters (controlled updates)
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public void setName(ProductName name) { 
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }

    public void setDescription(String description) { 
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public void setPrice(Money price) { 
        this.price = price;
        this.updatedAt = LocalDateTime.now();
    }

    public void setRating(Rating rating) { 
        this.rating = rating;
        this.updatedAt = LocalDateTime.now();
    }

    public void setCategory(String category) { 
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }

    public void setInStock(Boolean inStock) { 
        this.inStock = inStock;
        this.updatedAt = LocalDateTime.now();
    }

    public void setSpecifications(Map<String, String> specifications) { 
        this.specifications = specifications;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}