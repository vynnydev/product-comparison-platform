package com.hackerrank.sample.search.adapter.output.opensearch;

import com.hackerrank.sample.search.domain.model.SearchableProduct;
import org.opensearch.action.admin.indices.create.CreateIndexRequest;
import org.opensearch.action.bulk.BulkRequest;
import org.opensearch.action.bulk.BulkResponse;
import org.opensearch.action.delete.DeleteRequest;
import org.opensearch.action.index.IndexRequest;
import org.opensearch.action.search.SearchRequest;
import org.opensearch.action.search.SearchResponse;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.indices.GetIndexRequest;
import org.opensearch.common.xcontent.XContentType;
import org.opensearch.index.query.BoolQueryBuilder;
import org.opensearch.index.query.QueryBuilders;
import org.opensearch.search.SearchHit;
import org.opensearch.search.builder.SearchSourceBuilder;
import org.opensearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * OpenSearch Index Service for full-text search
 */
@Service
public class OpenSearchIndexService {

    private static final Logger logger = LoggerFactory.getLogger(OpenSearchIndexService.class);
    private static final String INDEX_NAME = "products";

    private final RestHighLevelClient client;

    @Value("${opensearch.enabled:true}")
    private boolean opensearchEnabled;

    @Autowired
    public OpenSearchIndexService(RestHighLevelClient client) {
        this.client = client;
    }

    @PostConstruct
    public void init() {
        if (opensearchEnabled) {
            try {
                createIndexIfNotExists();
            } catch (Exception e) {
                logger.error("Failed to initialize OpenSearch: {}", e.getMessage());
            }
        }
    }

    // ========================================
    // INDEX MANAGEMENT
    // ========================================

    public void createIndexIfNotExists() throws IOException {
        GetIndexRequest getRequest = new GetIndexRequest(INDEX_NAME);
        boolean exists = client.indices().exists(getRequest, RequestOptions.DEFAULT);

        if (!exists) {
            CreateIndexRequest createRequest = new CreateIndexRequest(INDEX_NAME);
            createRequest.source(getIndexMapping(), XContentType.JSON);
            client.indices().create(createRequest, RequestOptions.DEFAULT);
            logger.info("Created OpenSearch index: {}", INDEX_NAME);
        }
    }

    private String getIndexMapping() {
        return """
            {
                "settings": {
                    "number_of_shards": 1,
                    "number_of_replicas": 0,
                    "analysis": {
                        "analyzer": {
                            "product_analyzer": {
                                "type": "custom",
                                "tokenizer": "standard",
                                "filter": ["lowercase", "asciifolding"]
                            }
                        }
                    }
                },
                "mappings": {
                    "properties": {
                        "id": { "type": "long" },
                        "name": { "type": "text", "analyzer": "product_analyzer" },
                        "description": { "type": "text", "analyzer": "product_analyzer" },
                        "price": { "type": "float" },
                        "category": { "type": "keyword" },
                        "rating": { "type": "float" },
                        "inStock": { "type": "boolean" },
                        "aiSummary": { "type": "text" },
                        "aiKeywords": { "type": "text" },
                        "aiSentiment": { "type": "keyword" },
                        "aiScore": { "type": "float" },
                        "searchScore": { "type": "float" },
                        "analysisCompleted": { "type": "boolean" }
                    }
                }
            }
            """;
    }

    // ========================================
    // DOCUMENT OPERATIONS
    // ========================================

    public void indexProduct(SearchableProduct product) throws IOException {
        if (!opensearchEnabled) return;

        Map<String, Object> doc = productToMap(product);
        IndexRequest request = new IndexRequest(INDEX_NAME)
                .id(String.valueOf(product.getId()))
                .source(doc, XContentType.JSON);

        client.index(request, RequestOptions.DEFAULT);
        logger.debug("Indexed product: {}", product.getId());
    }

    public void bulkIndexProducts(List<SearchableProduct> products) throws IOException {
        if (!opensearchEnabled || products.isEmpty()) return;

        BulkRequest bulkRequest = new BulkRequest();
        for (SearchableProduct product : products) {
            IndexRequest request = new IndexRequest(INDEX_NAME)
                    .id(String.valueOf(product.getId()))
                    .source(productToMap(product), XContentType.JSON);
            bulkRequest.add(request);
        }

        BulkResponse response = client.bulk(bulkRequest, RequestOptions.DEFAULT);
        if (response.hasFailures()) {
            logger.error("Bulk indexing failures: {}", response.buildFailureMessage());
        } else {
            logger.info("Bulk indexed {} products", products.size());
        }
    }

    public void deleteProduct(Long productId) throws IOException {
        if (!opensearchEnabled) return;
        
        DeleteRequest request = new DeleteRequest(INDEX_NAME, String.valueOf(productId));
        client.delete(request, RequestOptions.DEFAULT);
        logger.debug("Deleted product: {}", productId);
    }

    private Map<String, Object> productToMap(SearchableProduct p) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("id", p.getId());
        doc.put("name", p.getName());
        doc.put("description", p.getDescription());
        doc.put("price", p.getPrice());
        doc.put("category", p.getCategory());
        doc.put("rating", p.getRating());
        doc.put("inStock", p.getInStock());
        doc.put("aiSummary", p.getAiSummary());
        doc.put("aiKeywords", p.getAiKeywords());
        doc.put("aiSentiment", p.getAiSentiment());
        doc.put("aiScore", p.getAiScore());
        doc.put("searchScore", p.getSearchScore());
        doc.put("analysisCompleted", p.getAnalysisCompleted());
        return doc;
    }

    // ========================================
    // SEARCH OPERATIONS
    // ========================================

    public List<SearchableProduct> search(String query, int from, int size) throws IOException {
        if (!opensearchEnabled) return Collections.emptyList();

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(QueryBuilders.multiMatchQuery(query,
                "name^3", "description^2", "aiKeywords^2", "aiSummary")
                .fuzziness("AUTO"));
        sourceBuilder.from(from);
        sourceBuilder.size(size);
        sourceBuilder.sort("searchScore", SortOrder.DESC);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        return parseResponse(response);
    }

    public List<SearchableProduct> searchWithFilters(
            String query, String category,
            BigDecimal minPrice, BigDecimal maxPrice,
            Double minRating, Boolean inStock,
            int from, int size) throws IOException {

        if (!opensearchEnabled) return Collections.emptyList();

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

        if (query != null && !query.isEmpty()) {
            boolQuery.must(QueryBuilders.multiMatchQuery(query,
                    "name^3", "description^2", "aiKeywords").fuzziness("AUTO"));
        }

        if (category != null) {
            boolQuery.filter(QueryBuilders.termQuery("category", category));
        }
        if (minPrice != null) {
            boolQuery.filter(QueryBuilders.rangeQuery("price").gte(minPrice.doubleValue()));
        }
        if (maxPrice != null) {
            boolQuery.filter(QueryBuilders.rangeQuery("price").lte(maxPrice.doubleValue()));
        }
        if (minRating != null) {
            boolQuery.filter(QueryBuilders.rangeQuery("rating").gte(minRating));
        }
        if (inStock != null && inStock) {
            boolQuery.filter(QueryBuilders.termQuery("inStock", true));
        }

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(boolQuery);
        sourceBuilder.from(from);
        sourceBuilder.size(size);
        sourceBuilder.sort("searchScore", SortOrder.DESC);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        return parseResponse(response);
    }

    public List<SearchableProduct> searchByAiKeywords(String keywords, int size) throws IOException {
        if (!opensearchEnabled) return Collections.emptyList();

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(QueryBuilders.matchQuery("aiKeywords", keywords));
        sourceBuilder.size(size);
        sourceBuilder.sort("aiScore", SortOrder.DESC);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        return parseResponse(response);
    }

    public List<SearchableProduct> searchBySentiment(String sentiment, int size) throws IOException {
        if (!opensearchEnabled) return Collections.emptyList();

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(QueryBuilders.termQuery("aiSentiment", sentiment.toLowerCase()));
        sourceBuilder.size(size);
        sourceBuilder.sort("aiScore", SortOrder.DESC);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        return parseResponse(response);
    }

    public List<SearchableProduct> getTopRatedWithAnalysis(int size) throws IOException {
        if (!opensearchEnabled) return Collections.emptyList();

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        boolQuery.filter(QueryBuilders.termQuery("analysisCompleted", true));

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(boolQuery);
        sourceBuilder.size(size);
        sourceBuilder.sort("aiScore", SortOrder.DESC);
        sourceBuilder.sort("rating", SortOrder.DESC);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        return parseResponse(response);
    }

    // ========================================
    // RESPONSE PARSING
    // ========================================

    private List<SearchableProduct> parseResponse(SearchResponse response) {
        return Arrays.stream(response.getHits().getHits())
                .map(this::hitToProduct)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private SearchableProduct hitToProduct(SearchHit hit) {
        try {
            Map<String, Object> src = hit.getSourceAsMap();
            SearchableProduct p = new SearchableProduct();
            
            p.setId(((Number) src.get("id")).longValue());
            p.setName((String) src.get("name"));
            p.setDescription((String) src.get("description"));
            if (src.get("price") != null) {
                p.setPrice(BigDecimal.valueOf(((Number) src.get("price")).doubleValue()));
            }
            p.setCategory((String) src.get("category"));
            if (src.get("rating") != null) {
                p.setRating(((Number) src.get("rating")).doubleValue());
            }
            p.setInStock((Boolean) src.get("inStock"));
            p.setAiSummary((String) src.get("aiSummary"));
            p.setAiKeywords((String) src.get("aiKeywords"));
            p.setAiSentiment((String) src.get("aiSentiment"));
            if (src.get("aiScore") != null) {
                p.setAiScore(BigDecimal.valueOf(((Number) src.get("aiScore")).doubleValue()));
            }
            if (src.get("searchScore") != null) {
                p.setSearchScore(((Number) src.get("searchScore")).intValue());
            }
            p.setAnalysisCompleted((Boolean) src.get("analysisCompleted"));
            
            return p;
        } catch (Exception e) {
            logger.error("Failed to parse hit: {}", e.getMessage());
            return null;
        }
    }

    // ========================================
    // STATISTICS
    // ========================================

    public Map<String, Object> getIndexStats() throws IOException {
        Map<String, Object> stats = new HashMap<>();
        stats.put("enabled", opensearchEnabled);
        
        if (!opensearchEnabled) return stats;

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.size(0);

        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        stats.put("totalDocuments", response.getHits().getTotalHits().value);
        stats.put("indexName", INDEX_NAME);
        
        return stats;
    }
}