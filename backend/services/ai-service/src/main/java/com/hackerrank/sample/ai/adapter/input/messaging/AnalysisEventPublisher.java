package com.hackerrank.sample.ai.adapter.output.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Event Publisher for Analysis events.
 * 
 * Publishes: ANALYSIS_COMPLETED
 * Consumer: Search-Service
 * 
 * This allows the Search Service to enrich its index with AI analysis data.
 */
@Component
public class AnalysisEventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalysisEventPublisher.class);
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.analysis:analysis.exchange}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key.analysis-completed:analysis.completed}")
    private String routingKeyAnalysisCompleted;
    
    @Autowired
    public AnalysisEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    /**
     * Publish ANALYSIS_COMPLETED event after AI analysis is done.
     * 
     * @param productId The ID of the analyzed product
     * @param summary AI-generated summary
     * @param keywords AI-extracted keywords
     * @param sentiment Sentiment analysis result (positive, negative, neutral)
     * @param score AI quality score (0-10)
     * @param recommendations AI-generated recommendations
     */
    public void publishAnalysisCompleted(Long productId, String summary, String keywords, 
                                         String sentiment, BigDecimal score, String recommendations) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ANALYSIS_COMPLETED");
            event.put("timestamp", LocalDateTime.now().toString());
            event.put("productId", productId);
            
            Map<String, Object> analysisData = new HashMap<>();
            analysisData.put("summary", summary);
            analysisData.put("keywords", keywords);
            analysisData.put("sentiment", sentiment);
            analysisData.put("score", score);
            analysisData.put("recommendations", recommendations);
            
            event.put("analysis", analysisData);
            
            rabbitTemplate.convertAndSend(exchange, routingKeyAnalysisCompleted, event);
            
            logger.info("Published ANALYSIS_COMPLETED event for product: {}", productId);
            
        } catch (Exception e) {
            logger.error("Failed to publish ANALYSIS_COMPLETED event for product {}: {}", 
                    productId, e.getMessage());
            // Don't throw - analysis was successful, just event publishing failed
            // Could implement retry logic or dead letter handling here
        }
    }
    
    /**
     * Simplified version for publishing analysis result.
     * 
     * @param productId The ID of the analyzed product
     * @param analysisResult Map containing analysis data
     */
    public void publishAnalysisCompleted(Long productId, Map<String, Object> analysisResult) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ANALYSIS_COMPLETED");
            event.put("timestamp", LocalDateTime.now().toString());
            event.put("productId", productId);
            event.put("analysis", analysisResult);
            
            rabbitTemplate.convertAndSend(exchange, routingKeyAnalysisCompleted, event);
            
            logger.info("Published ANALYSIS_COMPLETED event for product: {}", productId);
            
        } catch (Exception e) {
            logger.error("Failed to publish ANALYSIS_COMPLETED event for product {}: {}", 
                    productId, e.getMessage());
        }
    }
}