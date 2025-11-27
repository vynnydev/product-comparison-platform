package com.hackerrank.sample.ai.adapter.output.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackerrank.sample.ai.domain.model.ProductAnalysis;
import com.hackerrank.sample.ai.domain.model.ProductComparison;
import com.hackerrank.sample.ai.domain.model.SearchEnhancement;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
@Profile("cloud")
public class LambdaAIAdapter implements AIService {
    
    @Value("${ai.lambda.api-gateway-url}")
    private String apiGatewayUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public LambdaAIAdapter() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    @Override
    public ProductAnalysis analyzeProduct(Map<String, Object> productData) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("operation", "analyze_product");
            request.put("productData", productData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                apiGatewayUrl,
                entity,
                Map.class
            );
            
            Map<String, Object> body = response.getBody();
            Map<String, Object> analysisData = (Map<String, Object>) body.get("analysis");
            
            ProductAnalysis analysis = new ProductAnalysis();
            analysis.setProductId(((Number) productData.get("id")).longValue());
            analysis.setProductName((String) productData.get("name"));
            analysis.setSummary((String) analysisData.get("summary"));
            analysis.setPros((List<String>) analysisData.get("pros"));
            analysis.setCons((List<String>) analysisData.get("cons"));
            analysis.setTargetAudience((String) analysisData.get("targetAudience"));
            analysis.setValueScore(((Number) analysisData.get("valueScore")).doubleValue());
            analysis.setRecommendedFor((List<String>) analysisData.get("recommendedFor"));
            
            Map<String, Object> metadata = (Map<String, Object>) body.get("metadata");
            analysis.setAiModel((String) metadata.get("model"));
            
            return analysis;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze product via Lambda: " + e.getMessage(), e);
        }
    }
    
    @Override
    public SearchEnhancement enhanceSearch(String query) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("operation", "enhance_search");
            request.put("query", query);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                apiGatewayUrl,
                entity,
                Map.class
            );
            
            Map<String, Object> body = response.getBody();
            
            SearchEnhancement enhancement = new SearchEnhancement();
            enhancement.setOriginalQuery((String) body.get("originalQuery"));
            enhancement.setEnhancedQuery((String) body.get("enhancedQuery"));
            enhancement.setSynonyms((List<String>) body.get("synonyms"));
            enhancement.setIntent(SearchEnhancement.SearchIntent.valueOf((String) body.get("intent")));
            enhancement.setConfidence(((Number) body.get("confidence")).doubleValue());
            enhancement.setSuggestedFilters((Map<String, Object>) body.get("suggestedFilters"));
            
            return enhancement;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to enhance search via Lambda: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ProductComparison compareProducts(List<Map<String, Object>> products) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("operation", "compare_products");
            request.put("products", products);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                apiGatewayUrl,
                entity,
                Map.class
            );
            
            Map<String, Object> body = response.getBody();
            
            ProductComparison comparison = new ProductComparison();
            comparison.setWinnerProductId(((Number) body.get("winnerProductId")).longValue());
            comparison.setReasoning((String) body.get("reasoning"));
            
            Map<String, Map<String, Object>> breakdownData = 
                (Map<String, Map<String, Object>>) body.get("breakdown");
            
            Map<String, ProductComparison.ComparisonDimension> breakdown = new HashMap<>();
            for (Map.Entry<String, Map<String, Object>> entry : breakdownData.entrySet()) {
                Map<String, Object> dimData = entry.getValue();
                ProductComparison.ComparisonDimension dimension = 
                    new ProductComparison.ComparisonDimension(
                        ((Number) dimData.get("winnerProductId")).longValue(),
                        ((Number) dimData.get("score")).doubleValue(),
                        (String) dimData.get("explanation")
                    );
                breakdown.put(entry.getKey(), dimension);
            }
            comparison.setBreakdown(breakdown);
            
            return comparison;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to compare products via Lambda: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean isAvailable() {
        return true;
    }
    
    @Override
    public String getProviderName() {
        return "AWS Lambda + Bedrock (Claude 4.5 Sonnet)";
    }
}