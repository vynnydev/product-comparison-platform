 package com.hackerrank.sample.search.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for Search Service
 * 
 * Exchanges:
 * - products.exchange (Topic) - Product events
 * - analysis.exchange (Topic) - AI Analysis events
 * 
 * Queues:
 * - search.product.events - Receives product created/updated/deleted
 * - search.analysis.events - Receives analysis completed events
 * 
 * Bindings:
 * - products.exchange -> search.product.events (routing: product.*)
 * - analysis.exchange -> search.analysis.events (routing: analysis.*)
 */
@Configuration
public class RabbitMQConfig {
    
    // ============================================
    // EXCHANGE NAMES
    // ============================================
    
    @Value("${rabbitmq.exchange.products:products.exchange}")
    private String productsExchange;
    
    @Value("${rabbitmq.exchange.analysis:analysis.exchange}")
    private String analysisExchange;
    
    // ============================================
    // QUEUE NAMES
    // ============================================
    
    @Value("${rabbitmq.queue.search-product-events:search.product.events}")
    private String searchProductEventsQueue;
    
    @Value("${rabbitmq.queue.search-analysis-events:search.analysis.events}")
    private String searchAnalysisEventsQueue;
    
    // ============================================
    // ROUTING KEYS
    // ============================================
    
    @Value("${rabbitmq.routing-key.product-wildcard:product.*}")
    private String productWildcardRoutingKey;
    
    @Value("${rabbitmq.routing-key.analysis-wildcard:analysis.*}")
    private String analysisWildcardRoutingKey;
    
    // ============================================
    // EXCHANGES
    // ============================================
    
    @Bean
    public TopicExchange productsExchange() {
        return ExchangeBuilder
                .topicExchange(productsExchange)
                .durable(true)
                .build();
    }
    
    @Bean
    public TopicExchange analysisExchange() {
        return ExchangeBuilder
                .topicExchange(analysisExchange)
                .durable(true)
                .build();
    }
    
    // ============================================
    // QUEUES
    // ============================================
    
    @Bean
    public Queue searchProductEventsQueue() {
        return QueueBuilder
                .durable(searchProductEventsQueue)
                .withArgument("x-dead-letter-exchange", "dlx.exchange")
                .withArgument("x-dead-letter-routing-key", "dlq.search.product")
                .build();
    }
    
    @Bean
    public Queue searchAnalysisEventsQueue() {
        return QueueBuilder
                .durable(searchAnalysisEventsQueue)
                .withArgument("x-dead-letter-exchange", "dlx.exchange")
                .withArgument("x-dead-letter-routing-key", "dlq.search.analysis")
                .build();
    }
    
    // ============================================
    // DEAD LETTER QUEUE (DLQ)
    // ============================================
    
    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder
                .topicExchange("dlx.exchange")
                .durable(true)
                .build();
    }
    
    @Bean
    public Queue deadLetterQueueProduct() {
        return QueueBuilder
                .durable("dlq.search.product")
                .build();
    }
    
    @Bean
    public Queue deadLetterQueueAnalysis() {
        return QueueBuilder
                .durable("dlq.search.analysis")
                .build();
    }
    
    @Bean
    public Binding dlqProductBinding() {
        return BindingBuilder
                .bind(deadLetterQueueProduct())
                .to(deadLetterExchange())
                .with("dlq.search.product");
    }
    
    @Bean
    public Binding dlqAnalysisBinding() {
        return BindingBuilder
                .bind(deadLetterQueueAnalysis())
                .to(deadLetterExchange())
                .with("dlq.search.analysis");
    }
    
    // ============================================
    // BINDINGS
    // ============================================
    
    @Bean
    public Binding productEventsBinding() {
        return BindingBuilder
                .bind(searchProductEventsQueue())
                .to(productsExchange())
                .with(productWildcardRoutingKey);
    }
    
    @Bean
    public Binding analysisEventsBinding() {
        return BindingBuilder
                .bind(searchAnalysisEventsQueue())
                .to(analysisExchange())
                .with(analysisWildcardRoutingKey);
    }
    
    // ============================================
    // MESSAGE CONVERTER
    // ============================================
    
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}