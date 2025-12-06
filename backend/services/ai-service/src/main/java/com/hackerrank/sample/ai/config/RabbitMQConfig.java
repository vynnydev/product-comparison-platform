package com.hackerrank.sample.ai.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for AI Service
 * 
 * Consumes from:
 * - products.exchange (product.created, product.updated)
 * 
 * Publishes to:
 * - analysis.exchange (analysis.completed)
 */
@Configuration
public class RabbitMQConfig {
    
    // ============================================
    // CONSUME: Product Events
    // ============================================
    
    @Value("${rabbitmq.exchange.products:products.exchange}")
    private String productsExchange;
    
    @Value("${rabbitmq.queue.product-events:product.events}")
    private String productEventsQueue;
    
    @Value("${rabbitmq.routing-key.product-created:product.created}")
    private String routingKeyProductCreated;
    
    // ============================================
    // PUBLISH: Analysis Events
    // ============================================
    
    @Value("${rabbitmq.exchange.analysis:analysis.exchange}")
    private String analysisExchange;
    
    @Value("${rabbitmq.routing-key.analysis-completed:analysis.completed}")
    private String routingKeyAnalysisCompleted;
    
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
    public Queue productEventsQueue() {
        return QueueBuilder
                .durable(productEventsQueue)
                .withArgument("x-dead-letter-exchange", "dlx.exchange")
                .withArgument("x-dead-letter-routing-key", "dlq.ai.product")
                .build();
    }
    
    // ============================================
    // DEAD LETTER QUEUE
    // ============================================
    
    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder
                .topicExchange("dlx.exchange")
                .durable(true)
                .build();
    }
    
    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder
                .durable("dlq.ai.product")
                .build();
    }
    
    @Bean
    public Binding dlqBinding() {
        return BindingBuilder
                .bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with("dlq.ai.product");
    }
    
    // ============================================
    // BINDINGS
    // ============================================
    
    @Bean
    public Binding productEventsBinding() {
        return BindingBuilder
                .bind(productEventsQueue())
                .to(productsExchange())
                .with("product.*");
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