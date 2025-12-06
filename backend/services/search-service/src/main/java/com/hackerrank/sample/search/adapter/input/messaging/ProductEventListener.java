package com.hackerrank.sample.search.adapter.input.messaging;

import com.hackerrank.sample.search.usecase.IndexProductUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Event Listener for Product events from Product-Service.
 * 
 * Listens to: product.created, product.updated, product.deleted
 * Action: Index/Update/Remove products in search index
 */
@Component
public class ProductEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductEventListener.class);
    
    private final IndexProductUseCase indexProductUseCase;
    
    @Autowired
    public ProductEventListener(IndexProductUseCase indexProductUseCase) {
        this.indexProductUseCase = indexProductUseCase;
    }
    
    /**
     * Listen to product events from products.exchange
     */
    @RabbitListener(queues = "${rabbitmq.queue.search-product-events:search.product.events}")
    public void handleProductEvent(Map<String, Object> event) {
        try {
            String eventType = (String) event.get("eventType");
            logger.info("Received product event: {}", eventType);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> productData = (Map<String, Object>) event.get("data");
            
            if (productData == null) {
                logger.warn("Product data is null in event: {}", eventType);
                return;
            }
            
            switch (eventType) {
                case "PRODUCT_CREATED":
                    handleProductCreated(productData);
                    break;
                    
                case "PRODUCT_UPDATED":
                    handleProductUpdated(productData);
                    break;
                    
                case "PRODUCT_DELETED":
                    handleProductDeleted(productData);
                    break;
                    
                default:
                    logger.warn("Unknown event type: {}", eventType);
            }
            
        } catch (Exception e) {
            logger.error("Error processing product event: {}", e.getMessage(), e);
            // Message will be sent to DLQ due to exception
            throw new RuntimeException("Failed to process product event", e);
        }
    }
    
    private void handleProductCreated(Map<String, Object> productData) {
        logger.info("Indexing new product: {}", productData.get("name"));
        try {
            indexProductUseCase.indexProduct(productData);
            logger.info("Product indexed successfully: {}", productData.get("id"));
        } catch (Exception e) {
            logger.error("Failed to index product: {}", e.getMessage());
            throw e;
        }
    }
    
    private void handleProductUpdated(Map<String, Object> productData) {
        logger.info("Updating product in index: {}", productData.get("name"));
        try {
            indexProductUseCase.indexProduct(productData);
            logger.info("Product updated in index: {}", productData.get("id"));
        } catch (Exception e) {
            logger.error("Failed to update product in index: {}", e.getMessage());
            throw e;
        }
    }
    
    private void handleProductDeleted(Map<String, Object> productData) {
        Object idObj = productData.get("id");
        if (idObj == null) {
            logger.warn("Product ID is missing in delete event");
            return;
        }
        
        Long productId = idObj instanceof Long ? (Long) idObj : Long.parseLong(idObj.toString());
        logger.info("Removing product from index: {}", productId);
        
        try {
            indexProductUseCase.removeProduct(productId);
            logger.info("Product removed from index: {}", productId);
        } catch (Exception e) {
            logger.error("Failed to remove product from index: {}", e.getMessage());
            throw e;
        }
    }
}