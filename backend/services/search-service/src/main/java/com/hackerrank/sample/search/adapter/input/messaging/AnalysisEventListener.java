package com.hackerrank.sample.search.adapter.input.messaging;

import com.hackerrank.sample.search.usecase.IndexProductUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Event Listener for Analysis events from AI-Service.
 * 
 * Listens to: analysis.completed
 * Action: Enrich product in search index with AI analysis data
 */
@Component
public class AnalysisEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalysisEventListener.class);
    
    private final IndexProductUseCase indexProductUseCase;
    
    @Autowired
    public AnalysisEventListener(IndexProductUseCase indexProductUseCase) {
        this.indexProductUseCase = indexProductUseCase;
    }
    
    /**
     * Listen to analysis events from analysis.exchange
     */
    @RabbitListener(queues = "${rabbitmq.queue.search-analysis-events:search.analysis.events}")
    public void handleAnalysisEvent(Map<String, Object> event) {
        try {
            String eventType = (String) event.get("eventType");
            logger.info("Received analysis event: {}", eventType);
            
            if (!"ANALYSIS_COMPLETED".equals(eventType)) {
                logger.warn("Unexpected event type: {}", eventType);
                return;
            }
            
            handleAnalysisCompleted(event);
            
        } catch (Exception e) {
            logger.error("Error processing analysis event: {}", e.getMessage(), e);
            // Message will be sent to DLQ due to exception
            throw new RuntimeException("Failed to process analysis event", e);
        }
    }
    
    private void handleAnalysisCompleted(Map<String, Object> event) {
        // Extract product ID
        Object productIdObj = event.get("productId");
        if (productIdObj == null) {
            logger.warn("Product ID is missing in analysis event");
            return;
        }
        
        Long productId = productIdObj instanceof Long 
                ? (Long) productIdObj 
                : Long.parseLong(productIdObj.toString());
        
        logger.info("Enriching product {} with AI analysis", productId);
        
        // Extract analysis data
        @SuppressWarnings("unchecked")
        Map<String, Object> analysisData = (Map<String, Object>) event.get("analysis");
        
        if (analysisData == null) {
            logger.warn("Analysis data is null for product: {}", productId);
            return;
        }
        
        try {
            indexProductUseCase.enrichWithAnalysis(productId, analysisData);
            logger.info("Product {} enriched with AI analysis successfully", productId);
        } catch (Exception e) {
            logger.error("Failed to enrich product {} with analysis: {}", productId, e.getMessage());
            throw e;
        }
    }
}