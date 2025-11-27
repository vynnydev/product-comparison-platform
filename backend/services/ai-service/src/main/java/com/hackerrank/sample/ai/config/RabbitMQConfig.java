package com.hackerrank.sample.ai.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for AI-Service (Consumer)
 * 
 * CORREÇÃO: Usa properties que JÁ EXISTEM no application-docker.properties
 * 
 * Properties usadas:
 * - rabbitmq.exchange.products (estava "products", mudado para "name")
 * - rabbitmq.queue.product-events
 * - rabbitmq.routing-key.product-created
 */
@Configuration
public class RabbitMQConfig {
    
    // ✅ CORRIGIDO: Usar "rabbitmq.exchange.name" (não "rabbitmq.exchange.products")
    @Value("${rabbitmq.exchange.name:products.exchange}")
    private String exchange;
    
    @Value("${rabbitmq.queue.product-events:product.ai.analysis.queue}")
    private String queueName;
    
    @Value("${rabbitmq.routing-key.product-created:product.created}")
    private String routingKeyCreated;
    
    @Value("${rabbitmq.routing-key.product-updated:product.updated}")
    private String routingKeyUpdated;
    
    /**
     * Declare the queue that will receive product events
     */
    @Bean
    public Queue productEventsQueue() {
        return new Queue(queueName, true); // durable = true
    }
    
    /**
     * Declare the exchange (must match product-service)
     */
    @Bean
    public TopicExchange productsExchange() {
        return new TopicExchange(exchange);
    }
    
    /**
     * Bind queue to exchange with routing key for PRODUCT_CREATED
     */
    @Bean
    public Binding bindingProductCreated(Queue productEventsQueue, TopicExchange productsExchange) {
        return BindingBuilder
                .bind(productEventsQueue)
                .to(productsExchange)
                .with(routingKeyCreated);
    }
    
    /**
     * Bind queue to exchange with routing key for PRODUCT_UPDATED
     */
    @Bean
    public Binding bindingProductUpdated(Queue productEventsQueue, TopicExchange productsExchange) {
        return BindingBuilder
                .bind(productEventsQueue)
                .to(productsExchange)
                .with(routingKeyUpdated);
    }
    
    /**
     * Optional: Bind to wildcard pattern (all product events)
     */
    @Bean
    public Binding bindingProductAll(Queue productEventsQueue, TopicExchange productsExchange) {
        return BindingBuilder
                .bind(productEventsQueue)
                .to(productsExchange)
                .with("product.#"); // Matches: product.created, product.updated, product.deleted
    }
    
    /**
     * JSON message converter
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    /**
     * RabbitTemplate with JSON converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}