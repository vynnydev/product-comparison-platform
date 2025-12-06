package com.productcomparison.search.config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestClientBuilder;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.json.jackson.JacksonJsonpMapper;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.rest_client.RestClientTransport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PreDestroy;
import java.io.IOException;

/**
 * OpenSearch Configuration for Search Service
 * 
 * Provides:
 * - Full-text search
 * - Product indexing
 * - Advanced queries
 */
@Configuration
public class OpenSearchConfig {

    private static final Logger logger = LoggerFactory.getLogger(OpenSearchConfig.class);

    @Value("${opensearch.host:localhost}")
    private String host;

    @Value("${opensearch.port:9200}")
    private int port;

    @Value("${opensearch.scheme:https}")
    private String scheme;

    @Value("${opensearch.username:admin}")
    private String username;

    @Value("${opensearch.password:admin}")
    private String password;

    @Value("${opensearch.connect-timeout:5000}")
    private int connectTimeout;

    @Value("${opensearch.socket-timeout:60000}")
    private int socketTimeout;

    private RestHighLevelClient restHighLevelClient;
    private RestClient restClient;

    /**
     * Low-level REST Client
     */
    @Bean
    public RestClient restClient() {
        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                AuthScope.ANY,
                new UsernamePasswordCredentials(username, password)
        );

        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, scheme))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
                        // Disable SSL verification for dev (enable in prod)
                        .setSSLHostnameVerifier((hostname, session) -> true)
                )
                .setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder
                        .setConnectTimeout(connectTimeout)
                        .setSocketTimeout(socketTimeout)
                );

        this.restClient = builder.build();
        logger.info("OpenSearch RestClient initialized: {}://{}:{}", scheme, host, port);
        return restClient;
    }

    /**
     * High-level REST Client (for legacy API)
     */
    @Bean
    public RestHighLevelClient restHighLevelClient() {
        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                AuthScope.ANY,
                new UsernamePasswordCredentials(username, password)
        );

        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, scheme))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
                        .setSSLHostnameVerifier((hostname, session) -> true)
                )
                .setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder
                        .setConnectTimeout(connectTimeout)
                        .setSocketTimeout(socketTimeout)
                );

        this.restHighLevelClient = new RestHighLevelClient(builder);
        logger.info("OpenSearch RestHighLevelClient initialized");
        return restHighLevelClient;
    }

    /**
     * New OpenSearch Java Client
     */
    @Bean
    public OpenSearchClient openSearchClient(RestClient restClient) {
        RestClientTransport transport = new RestClientTransport(
                restClient,
                new JacksonJsonpMapper()
        );
        
        logger.info("OpenSearch Java Client initialized");
        return new OpenSearchClient(transport);
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (restHighLevelClient != null) {
                restHighLevelClient.close();
            }
            if (restClient != null) {
                restClient.close();
            }
            logger.info("OpenSearch clients closed");
        } catch (IOException e) {
            logger.error("Error closing OpenSearch clients", e);
        }
    }
}