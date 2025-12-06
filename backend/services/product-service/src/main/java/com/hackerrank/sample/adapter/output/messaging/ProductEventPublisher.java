package com.hackerrank.sample.adapter.output.messaging;

import com.hackerrank.sample.domain.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class ProductEventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductEventPublisher.class);
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.products}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key.product-created}")
    private String routingKeyCreated;
    
    @Value("${rabbitmq.routing-key.product-updated}")
    private String routingKeyUpdated;
    
    @Value("${rabbitmq.routing-key.product-deleted:product.deleted}")
    private String routingKeyDeleted;
    
    @Autowired
    public ProductEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    public void publishProductCreated(Product product) {
        Map<String, Object> event = createEvent("PRODUCT_CREATED", product);
        rabbitTemplate.convertAndSend(exchange, routingKeyCreated, event);
        logger.info("Published PRODUCT_CREATED event for product: {}", product.getId());
    }
    
    public void publishProductUpdated(Product product) {
        Map<String, Object> event = createEvent("PRODUCT_UPDATED", product);
        rabbitTemplate.convertAndSend(exchange, routingKeyUpdated, event);
        logger.info("Published PRODUCT_UPDATED event for product: {}", product.getId());
    }
    
    /**
     * NEW: Publish PRODUCT_DELETED event.
     * 
     * This event is consumed by:
     * - AI-Service: to remove analysis data
     * - Search-Service: to remove product from search index
     * 
     * @param productId The ID of the deleted product
     */
    public void publishProductDeleted(Long productId) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "PRODUCT_DELETED");
        event.put("timestamp", LocalDateTime.now().toString());
        
        Map<String, Object> productData = new HashMap<>();
        productData.put("id", productId);
        event.put("data", productData);
        
        rabbitTemplate.convertAndSend(exchange, routingKeyDeleted, event);
        logger.info("Published PRODUCT_DELETED event for product: {}", productId);
    }
    
    private Map<String, Object> createEvent(String eventType, Product product) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", eventType);
        event.put("timestamp", LocalDateTime.now().toString());
        
        Map<String, Object> productData = new HashMap<>();
        productData.put("id", product.getId());
        productData.put("name", product.getName().getValue());
        productData.put("description", product.getDescription());
        productData.put("price", product.getPrice().getAmount());
        productData.put("rating", product.getRating().getValue());
        productData.put("category", product.getCategory());
        productData.put("inStock", product.getInStock());
        productData.put("specifications", product.getSpecifications());
        
        event.put("data", productData);
        
        return event;
    }
}