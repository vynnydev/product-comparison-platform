package com.hackerrank.sample.config;

import com.hackerrank.sample.adapter.output.messaging.ProductEventPublisher;
import com.hackerrank.sample.domain.repository.ProductRepository;
import com.hackerrank.sample.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfiguration {
    
    @Bean
    public CreateProductUseCase createProductUseCase(
            ProductRepository productRepository,
            ProductEventPublisher eventPublisher) {
        return new CreateProductUseCase(productRepository, eventPublisher);
    }
    
    @Bean
    public GetAllProductsUseCase getAllProductsUseCase(ProductRepository productRepository) {
        return new GetAllProductsUseCase(productRepository);
    }
    
    @Bean
    public GetProductByIdUseCase getProductByIdUseCase(ProductRepository productRepository) {
        return new GetProductByIdUseCase(productRepository);
    }
    
    @Bean
    public UpdateProductUseCase updateProductUseCase(
            ProductRepository productRepository,
            ProductEventPublisher eventPublisher) {
        return new UpdateProductUseCase(productRepository, eventPublisher);
    }
    
    @Bean
    public DeleteProductUseCase deleteProductUseCase(ProductRepository productRepository) {
        return new DeleteProductUseCase(productRepository);
    }
    
    @Bean
    public DeleteAllProductsUseCase deleteAllProductsUseCase(ProductRepository productRepository) {
        return new DeleteAllProductsUseCase(productRepository);
    }
    
    @Bean
    public SearchProductsUseCase searchProductsUseCase(ProductRepository productRepository) {
        return new SearchProductsUseCase(productRepository);
    }
}