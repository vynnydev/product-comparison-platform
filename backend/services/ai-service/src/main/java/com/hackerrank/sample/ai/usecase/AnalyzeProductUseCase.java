package com.hackerrank.sample.ai.usecase;

import com.hackerrank.sample.ai.adapter.output.messaging.AnalysisEventPublisher;
import com.hackerrank.sample.ai.domain.model.ProductAnalysis;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Use Case: Analyze product with AI.
 * 
 * Business logic:
 * 1. Validate product data
 * 2. Call AI service
 * 3. Publish ANALYSIS_COMPLETED event (for Search-Service)
 * 4. Return analysis
 */
@Service
public class AnalyzeProductUseCase {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyzeProductUseCase.class);
    
    private final AIService aiService;
    private final AnalysisEventPublisher analysisEventPublisher;
    
    @Autowired
    public AnalyzeProductUseCase(AIService aiService, AnalysisEventPublisher analysisEventPublisher) {
        this.aiService = aiService;
        this.analysisEventPublisher = analysisEventPublisher;
    }
    
    public ProductAnalysis execute(Map<String, Object> productData) {
        // Validate required fields
        validateProductData(productData);
        
        Long productId = extractProductId(productData);
        logger.info("Starting AI analysis for product: {}", productId);
        
        // Analyze with AI
        ProductAnalysis analysis = aiService.analyzeProduct(productData);
        
        // Publish event for Search-Service to enrich its index
        publishAnalysisCompletedEvent(productId, analysis);
        
        logger.info("AI analysis completed for product: {}", productId);
        return analysis;
    }
    
    private void validateProductData(Map<String, Object> productData) {
        if (productData == null || productData.isEmpty()) {
            throw new IllegalArgumentException("Product data cannot be empty");
        }
        
        if (!productData.containsKey("id")) {
            throw new IllegalArgumentException("Product ID is required");
        }
        
        if (!productData.containsKey("name")) {
            throw new IllegalArgumentException("Product name is required");
        }
    }
    
    private Long extractProductId(Map<String, Object> productData) {
        Object id = productData.get("id");
        if (id instanceof Long) return (Long) id;
        if (id instanceof Integer) return ((Integer) id).longValue();
        if (id instanceof String) return Long.parseLong((String) id);
        throw new IllegalArgumentException("Invalid product ID format");
    }
    
    /**
     * Publish ANALYSIS_COMPLETED event so Search-Service can enrich its index.
     * 
     * Maps ProductAnalysis fields to the event format expected by Search-Service:
     * - summary → summary
     * - pros + cons → keywords
     * - pros vs cons ratio → sentiment
     * - valueScore → score
     * - targetAudience + recommendedFor → recommendations
     */
    private void publishAnalysisCompletedEvent(Long productId, ProductAnalysis analysis) {
        try {
            // 1. Summary - direto
            String summary = analysis.getSummary();
            
            // 2. Keywords - extraído de pros, cons e targetAudience
            String keywords = extractKeywords(analysis);
            
            // 3. Sentiment - calculado baseado em pros vs cons e valueScore
            String sentiment = calculateSentiment(analysis);
            
            // 4. Score - valueScore convertido para BigDecimal
            BigDecimal score = analysis.getValueScore() != null 
                    ? BigDecimal.valueOf(analysis.getValueScore()) 
                    : null;
            
            // 5. Recommendations - combinação de targetAudience e recommendedFor
            String recommendations = buildRecommendations(analysis);
            
            analysisEventPublisher.publishAnalysisCompleted(
                    productId,
                    summary,
                    keywords,
                    sentiment,
                    score,
                    recommendations
            );
            
            logger.debug("Published ANALYSIS_COMPLETED event for product: {}", productId);
            
        } catch (Exception e) {
            // Log but don't fail - analysis was successful, event publishing is secondary
            logger.warn("Failed to publish ANALYSIS_COMPLETED event for product {}: {}", 
                    productId, e.getMessage());
        }
    }
    
    /**
     * Extract keywords from pros, cons, and targetAudience.
     */
    private String extractKeywords(ProductAnalysis analysis) {
        StringBuilder keywords = new StringBuilder();
        
        // Add pros as positive keywords
        if (analysis.getPros() != null && !analysis.getPros().isEmpty()) {
            keywords.append(String.join(", ", analysis.getPros()));
        }
        
        // Add target audience
        if (analysis.getTargetAudience() != null && !analysis.getTargetAudience().isEmpty()) {
            if (keywords.length() > 0) keywords.append(", ");
            keywords.append(analysis.getTargetAudience());
        }
        
        // Add recommendedFor
        if (analysis.getRecommendedFor() != null && !analysis.getRecommendedFor().isEmpty()) {
            if (keywords.length() > 0) keywords.append(", ");
            keywords.append(String.join(", ", analysis.getRecommendedFor()));
        }
        
        return keywords.toString();
    }
    
    /**
     * Calculate sentiment based on pros vs cons ratio and valueScore.
     * - valueScore >= 7.0 OR more pros than cons = positive
     * - valueScore <= 4.0 OR more cons than pros = negative
     * - Otherwise = neutral
     */
    private String calculateSentiment(ProductAnalysis analysis) {
        int prosCount = analysis.getPros() != null ? analysis.getPros().size() : 0;
        int consCount = analysis.getCons() != null ? analysis.getCons().size() : 0;
        
        // Consider valueScore first (more reliable)
        Double valueScore = analysis.getValueScore();
        if (valueScore != null) {
            if (valueScore >= 7.0) return "positive";
            if (valueScore <= 4.0) return "negative";
        }
        
        // Fall back to pros/cons ratio
        if (prosCount > consCount) return "positive";
        if (consCount > prosCount) return "negative";
        
        return "neutral";
    }
    
    /**
     * Build recommendations string from targetAudience and recommendedFor.
     */
    private String buildRecommendations(ProductAnalysis analysis) {
        StringBuilder recommendations = new StringBuilder();
        
        if (analysis.getTargetAudience() != null && !analysis.getTargetAudience().isEmpty()) {
            recommendations.append("Público-alvo: ").append(analysis.getTargetAudience());
        }
        
        if (analysis.getRecommendedFor() != null && !analysis.getRecommendedFor().isEmpty()) {
            if (recommendations.length() > 0) recommendations.append(". ");
            recommendations.append("Recomendado para: ");
            recommendations.append(String.join(", ", analysis.getRecommendedFor()));
        }
        
        // Add pros summary if available
        if (analysis.getPros() != null && !analysis.getPros().isEmpty()) {
            if (recommendations.length() > 0) recommendations.append(". ");
            recommendations.append("Pontos fortes: ");
            recommendations.append(String.join(", ", analysis.getPros()));
        }
        
        return recommendations.toString();
    }
}