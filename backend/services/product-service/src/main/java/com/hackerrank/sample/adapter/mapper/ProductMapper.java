package com.hackerrank.sample.adapter.mapper;

import com.hackerrank.sample.adapter.input.dto.ProductRequestDTO;
import com.hackerrank.sample.adapter.input.dto.ProductResponseDTO;
import com.hackerrank.sample.adapter.output.persistence.entity.ProductEntity;
import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.valueobject.Money;
import com.hackerrank.sample.domain.valueobject.ProductName;
import com.hackerrank.sample.domain.valueobject.Rating;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Domain, DTO, and Entity objects.
 * 
 * This is crucial in Clean Architecture to maintain separation
 * between layers and prevent coupling.
 */
public class ProductMapper {

    // ====== DTO TO DOMAIN ======
    
    /**
     * Convert ProductRequestDTO to Domain Product
     */
    public static Product toDomain(ProductRequestDTO dto) {
        Product product = new Product();
        
        if (dto.getName() != null) {
            product.setName(ProductName.of(dto.getName()));
        }
        
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        
        if (dto.getPrice() != null) {
            product.setPrice(Money.of(dto.getPrice()));
        }
        
        if (dto.getRating() != null) {
            product.setRating(Rating.of(dto.getRating()));
        }
        
        product.setCategory(dto.getCategory());
        product.setInStock(dto.getInStock());
        product.setSpecifications(dto.getSpecifications());
        
        return product;
    }

    // ====== DOMAIN TO DTO ======
    
    /**
     * Convert Domain Product to ProductResponseDTO
     */
    public static ProductResponseDTO toResponseDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        
        dto.setId(product.getId());
        
        if (product.getName() != null) {
            dto.setName(product.getName().getValue());
        }
        
        dto.setDescription(product.getDescription());
        dto.setImageUrl(product.getImageUrl());
        
        if (product.getPrice() != null) {
            dto.setPrice(product.getPrice().getAmount());
        }
        
        if (product.getRating() != null) {
            dto.setRating(product.getRating().getValue());
        }
        
        dto.setCategory(product.getCategory());
        dto.setInStock(product.getInStock());
        dto.setSpecifications(product.getSpecifications());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        return dto;
    }
    
    /**
     * Convert list of Domain Products to list of ProductResponseDTOs
     */
    public static List<ProductResponseDTO> toResponseDTOList(List<Product> products) {
        return products.stream()
                .map(ProductMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ====== DOMAIN TO ENTITY ======
    
    /**
     * Convert Domain Product to JPA ProductEntity
     */
    public static ProductEntity toEntity(Product product) {
        ProductEntity entity = new ProductEntity();
        
        entity.setId(product.getId());
        
        if (product.getName() != null) {
            entity.setName(product.getName().getValue());
        }
        
        entity.setDescription(product.getDescription());
        entity.setImageUrl(product.getImageUrl());
        
        if (product.getPrice() != null) {
            entity.setPrice(product.getPrice().getAmount());
        }
        
        if (product.getRating() != null) {
            entity.setRating(product.getRating().getValue());
        }
        
        entity.setCategory(product.getCategory());
        entity.setInStock(product.getInStock());
        entity.setSpecifications(product.getSpecifications());
        entity.setCreatedAt(product.getCreatedAt());
        entity.setUpdatedAt(product.getUpdatedAt());
        
        return entity;
    }

    // ====== ENTITY TO DOMAIN ======
    
    /**
     * Convert JPA ProductEntity to Domain Product
     */
    public static Product toDomain(ProductEntity entity) {
        Product product = new Product();
        
        product.setId(entity.getId());
        
        if (entity.getName() != null) {
            product.setName(ProductName.of(entity.getName()));
        }
        
        product.setDescription(entity.getDescription());
        product.setImageUrl(entity.getImageUrl());
        
        if (entity.getPrice() != null) {
            product.setPrice(Money.of(entity.getPrice()));
        }
        
        if (entity.getRating() != null) {
            product.setRating(Rating.of(entity.getRating()));
        }
        
        product.setCategory(entity.getCategory());
        product.setInStock(entity.getInStock());
        product.setSpecifications(entity.getSpecifications());
        product.setCreatedAt(entity.getCreatedAt());
        product.setUpdatedAt(entity.getUpdatedAt());
        
        return product;
    }
    
    /**
     * Convert list of ProductEntities to list of Domain Products
     */
    public static List<Product> toDomainList(List<ProductEntity> entities) {
        return entities.stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }
}