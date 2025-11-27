package com.hackerrank.sample.ai.adapter.input.messaging;

import com.hackerrank.sample.ai.usecase.AnalyzeProductUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Event Listener for Product events from Product-Service.
 * 
 * Listens to: product.created, product.updated
 * Action: Automatically analyze products with AI
 */
@Component
public class ProductEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductEventListener.class);
    
    private final AnalyzeProductUseCase analyzeProductUseCase;
    
    @Autowired
    public ProductEventListener(AnalyzeProductUseCase analyzeProductUseCase) {
        this.analyzeProductUseCase = analyzeProductUseCase;
    }
    
    /**
     * Listen to product events
     */
    @RabbitListener(queues = "${rabbitmq.queue.product-events}")
    public void handleProductEvent(Map<String, Object> event) {
        try {
            String eventType = (String) event.get("eventType");
            logger.info("Received event: {}", eventType);
            
            if ("PRODUCT_CREATED".equals(eventType) || "PRODUCT_UPDATED".equals(eventType)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> productData = (Map<String, Object>) event.get("data");
                
                logger.info("Analyzing product: {}", productData.get("name"));
                
                // Analyze product asynchronously
                try {
                    analyzeProductUseCase.execute(productData);
                    logger.info("Product analysis completed for ID: {}", productData.get("id"));
                } catch (Exception e) {
                    logger.error("Error analyzing product: {}", e.getMessage());
                }
            }
            
        } catch (Exception e) {
            logger.error("Error processing product event: {}", e.getMessage(), e);
        }
    }
}