package com.hackerrank.sample.config;

import com.hackerrank.sample.domain.repository.IProductRepository;
import com.hackerrank.sample.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Configuration for Use Cases.
 * 
 * This configuration creates beans for all use cases,
 * injecting the repository interface (port) into them.
 * 
 * Clean Architecture principle: Use Cases don't know about Spring!
 * Spring knows about Use Cases, not the other way around.
 */
@Configuration
public class UseCaseConfiguration {

    /**
     * Bean for CreateProductUseCase
     */
    @Bean
    public CreateProductUseCase createProductUseCase(IProductRepository productRepository) {
        return new CreateProductUseCase(productRepository);
    }

    /**
     * Bean for GetProductByIdUseCase
     */
    @Bean
    public GetProductByIdUseCase getProductByIdUseCase(IProductRepository productRepository) {
        return new GetProductByIdUseCase(productRepository);
    }

    /**
     * Bean for GetAllProductsUseCase
     */
    @Bean
    public GetAllProductsUseCase getAllProductsUseCase(IProductRepository productRepository) {
        return new GetAllProductsUseCase(productRepository);
    }

    /**
     * Bean for UpdateProductUseCase
     */
    @Bean
    public UpdateProductUseCase updateProductUseCase(IProductRepository productRepository) {
        return new UpdateProductUseCase(productRepository);
    }

    /**
     * Bean for DeleteProductUseCase
     */
    @Bean
    public DeleteProductUseCase deleteProductUseCase(IProductRepository productRepository) {
        return new DeleteProductUseCase(productRepository);
    }

    /**
     * Bean for DeleteAllProductsUseCase
     */
    @Bean
    public DeleteAllProductsUseCase deleteAllProductsUseCase(IProductRepository productRepository) {
        return new DeleteAllProductsUseCase(productRepository);
    }

    /**
     * Bean for SearchProductsUseCase
     */
    @Bean
    public SearchProductsUseCase searchProductsUseCase(IProductRepository productRepository) {
        return new SearchProductsUseCase(productRepository);
    }
}