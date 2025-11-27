package com.hackerrank.sample.ai.adapter.input.dto;

import java.util.List;

public class CompareProductsRequestDTO {
    
    private List<Long> productIds;
    
    public CompareProductsRequestDTO() {}
    
    public List<Long> getProductIds() { return productIds; }
    public void setProductIds(List<Long> productIds) { this.productIds = productIds; }
}