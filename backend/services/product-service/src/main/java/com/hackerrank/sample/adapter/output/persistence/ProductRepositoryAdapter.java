package com.hackerrank.sample.adapter.output.persistence;

import com.hackerrank.sample.adapter.mapper.ProductMapper;
import com.hackerrank.sample.adapter.output.persistence.entity.ProductEntity;
import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.domain.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Adapter that implements the Domain Repository interface.
 * 
 * This is the bridge between our domain (inner circle) 
 * and the framework/database (outer circle).
 * 
 * It translates between Domain objects and JPA entities.
 */
@Component
public class ProductRepositoryAdapter implements ProductRepository {
    
    private final ProductJpaRepository jpaRepository;
    
    @Autowired
    public ProductRepositoryAdapter(ProductJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Product save(Product product) {
        ProductEntity entity = ProductMapper.toEntity(product);
        ProductEntity savedEntity = jpaRepository.save(entity);
        return ProductMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaRepository.findById(id)
                .map(ProductMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        List<ProductEntity> entities = jpaRepository.findAll();
        return ProductMapper.toDomainList(entities);
    }

    @Override
    public List<Product> findByCategory(String category) {
        List<ProductEntity> entities = jpaRepository.findByCategory(category);
        return ProductMapper.toDomainList(entities);
    }

    @Override
    public List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<ProductEntity> entities = jpaRepository.findByPriceRange(minPrice, maxPrice);
        return ProductMapper.toDomainList(entities);
    }

    @Override
    public List<Product> findByMinimumRating(Double minRating) {
        List<ProductEntity> entities = jpaRepository.findByMinimumRating(minRating);
        return ProductMapper.toDomainList(entities);
    }

    @Override
    public List<Product> searchByName(String keyword) {
        List<ProductEntity> entities = jpaRepository.findByNameContainingIgnoreCase(keyword);
        return ProductMapper.toDomainList(entities);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void deleteAll() {
        jpaRepository.deleteAll();
    }
}