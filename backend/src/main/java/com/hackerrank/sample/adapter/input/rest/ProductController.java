package com.hackerrank.sample.adapter.input.rest;

import com.hackerrank.sample.adapter.input.dto.ProductRequestDTO;
import com.hackerrank.sample.adapter.input.dto.ProductResponseDTO;
import com.hackerrank.sample.adapter.mapper.ProductMapper;
import com.hackerrank.sample.domain.model.Product;
import com.hackerrank.sample.usecase.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller - Input Adapter
 * 
 * This is part of the Interface Adapters layer.
 * It translates HTTP requests into Use Case calls and
 * converts domain responses back to HTTP responses.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {

    private final CreateProductUseCase createProductUseCase;
    private final GetProductByIdUseCase getProductByIdUseCase;
    private final GetAllProductsUseCase getAllProductsUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final DeleteAllProductsUseCase deleteAllProductsUseCase;
    private final SearchProductsUseCase searchProductsUseCase;

    @Autowired
    public ProductController(
            CreateProductUseCase createProductUseCase,
            GetProductByIdUseCase getProductByIdUseCase,
            GetAllProductsUseCase getAllProductsUseCase,
            UpdateProductUseCase updateProductUseCase,
            DeleteProductUseCase deleteProductUseCase,
            DeleteAllProductsUseCase deleteAllProductsUseCase,
            SearchProductsUseCase searchProductsUseCase) {
        this.createProductUseCase = createProductUseCase;
        this.getProductByIdUseCase = getProductByIdUseCase;
        this.getAllProductsUseCase = getAllProductsUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
        this.deleteAllProductsUseCase = deleteAllProductsUseCase;
        this.searchProductsUseCase = searchProductsUseCase;
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Product Comparison API - Clean Architecture v1.0");
    }

    /**
     * Create a new product
     */
    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        // Convert DTO to Domain
        Product product = ProductMapper.toDomain(requestDTO);
        
        // Execute Use Case
        Product createdProduct = createProductUseCase.execute(product);
        
        // Convert Domain to Response DTO
        ProductResponseDTO responseDTO = ProductMapper.toResponseDTO(createdProduct);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    /**
     * Get all products
     */
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<Product> products = getAllProductsUseCase.execute();
        List<ProductResponseDTO> responseDTOs = ProductMapper.toResponseDTOList(products);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        Product product = getProductByIdUseCase.execute(id);
        ProductResponseDTO responseDTO = ProductMapper.toResponseDTO(product);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Update product
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO requestDTO) {
        
        Product updatedData = ProductMapper.toDomain(requestDTO);
        Product updatedProduct = updateProductUseCase.execute(id, updatedData);
        ProductResponseDTO responseDTO = ProductMapper.toResponseDTO(updatedProduct);
        
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Delete product by ID
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        deleteProductUseCase.execute(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete all products
     */
    @DeleteMapping("/products/erase")
    public ResponseEntity<Void> deleteAllProducts() {
        deleteAllProductsUseCase.execute();
        return ResponseEntity.ok().build();
    }

    /**
     * Get products by category
     */
    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = searchProductsUseCase.byCategory(category);
        List<ProductResponseDTO> responseDTOs = ProductMapper.toResponseDTOList(products);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Get products by price range
     */
    @GetMapping("/products/price-range")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        
        List<Product> products = searchProductsUseCase.byPriceRange(min, max);
        List<ProductResponseDTO> responseDTOs = ProductMapper.toResponseDTOList(products);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Get products by minimum rating
     */
    @GetMapping("/products/rating")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByRating(@RequestParam Double min) {
        List<Product> products = searchProductsUseCase.byMinimumRating(min);
        List<ProductResponseDTO> responseDTOs = ProductMapper.toResponseDTOList(products);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Search products by name
     */
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<Product> products = searchProductsUseCase.byName(keyword);
        List<ProductResponseDTO> responseDTOs = ProductMapper.toResponseDTOList(products);
        return ResponseEntity.ok(responseDTOs);
    }
}