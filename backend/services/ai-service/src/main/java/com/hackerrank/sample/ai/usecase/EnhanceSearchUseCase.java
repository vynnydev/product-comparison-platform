package com.hackerrank.sample.ai.usecase;

import com.hackerrank.sample.ai.domain.model.SearchEnhancement;
import com.hackerrank.sample.ai.domain.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Use Case: Enhance search query with AI.
 * 
 * Relevant for Mercado Livre's Search team.
 */
@Service
public class EnhanceSearchUseCase {
    
    private final AIService aiService;
    
    @Autowired
    public EnhanceSearchUseCase(AIService aiService) {
        this.aiService = aiService;
    }
    
    public SearchEnhancement execute(String query) {
        // Validate query
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }
        
        // Enhance with AI
        return aiService.enhanceSearch(query.trim());
    }
}