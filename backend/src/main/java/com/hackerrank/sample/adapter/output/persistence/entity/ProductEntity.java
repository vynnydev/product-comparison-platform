package com.hackerrank.sample.adapter.output.persistence.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * JPA Entity for Product persistence.
 * 
 * This is NOT the domain model! It's a database representation.
 * Part of the Infrastructure layer (Frameworks & Drivers).
 */
@Entity
@Table(name = "products")
public class ProductEntity implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "DECIMAL(2,1) DEFAULT 0.0")
    private Double rating;

    @Column(nullable = false)
    private String category;

    @Column(name = "in_stock")
    private Boolean inStock;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_specifications", 
                     joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "spec_key")
    @Column(name = "spec_value", length = 500)
    private Map<String, String> specifications = new HashMap<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // JPA Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors
    public ProductEntity() {
        this.specifications = new HashMap<>();
        this.inStock = true;
        this.rating = 0.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Map<String, String> getSpecifications() { return specifications; }
    public void setSpecifications(Map<String, String> specifications) { 
        this.specifications = specifications; 
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}