package com.hackerrank.sample.adapter.output.messaging;

import com.hackerrank.sample.domain.model.Product;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class ProductEventPublisher {
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.products}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key.product-created}")
    private String routingKeyCreated;
    
    @Value("${rabbitmq.routing-key.product-updated}")
    private String routingKeyUpdated;
    
    @Autowired
    public ProductEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    public void publishProductCreated(Product product) {
        Map<String, Object> event = createEvent("PRODUCT_CREATED", product);
        rabbitTemplate.convertAndSend(exchange, routingKeyCreated, event);
    }
    
    public void publishProductUpdated(Product product) {
        Map<String, Object> event = createEvent("PRODUCT_UPDATED", product);
        rabbitTemplate.convertAndSend(exchange, routingKeyUpdated, event);
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