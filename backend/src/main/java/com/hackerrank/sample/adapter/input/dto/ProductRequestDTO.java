package com.hackerrank.sample.adapter.input.dto;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Data Transfer Object for Product Creation/Update Requests.
 * 
 * This is part of the Interface Adapters layer.
 * Used for HTTP requests coming from clients.
 */
public class ProductRequestDTO {
    
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Double rating;
    private String category;
    private Boolean inStock;
    private Map<String, String> specifications;

    // Constructors
    public ProductRequestDTO() {}

    public ProductRequestDTO(String name, String description, String imageUrl,
                            BigDecimal price, Double rating, String category,
                            Boolean inStock, Map<String, String> specifications) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.rating = rating;
        this.category = category;
        this.inStock = inStock;
        this.specifications = specifications;
    }

    // Getters and Setters
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
}