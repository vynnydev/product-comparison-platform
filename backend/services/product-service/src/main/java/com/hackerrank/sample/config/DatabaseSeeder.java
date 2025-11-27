package com.hackerrank.sample.config;

import com.hackerrank.sample.adapter.output.persistence.ProductJpaRepository;
import com.hackerrank.sample.adapter.output.persistence.entity.ProductEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Database seeder for initial test data.
 * 
 * Note: We're working directly with ProductEntity here because
 * this is infrastructure/setup code, not business logic.
 */
@Configuration
@Profile("!test")  // (não executar em ambiente de teste)
public class DatabaseSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Bean
    CommandLineRunner initDatabase(@Autowired ProductJpaRepository repository) {
        return args -> {
            logger.info("🌱 Seeding database with sample products...");

            repository.deleteAll();

            // Smartphones
            repository.save(createProductEntity(
                "iPhone 15 Pro Max",
                "Latest flagship smartphone with A17 Pro chip and titanium design",
                "https://example.com/iphone15pro.jpg",
                new BigDecimal("1199.99"),
                4.8,
                "Smartphones",
                createSpecs("Storage", "256GB", "Color", "Natural Titanium", 
                           "Screen", "6.7-inch Super Retina XDR", "Processor", "A17 Pro")
            ));

            repository.save(createProductEntity(
                "Samsung Galaxy S24 Ultra",
                "Premium Android flagship with S Pen and 200MP camera",
                "https://example.com/galaxys24ultra.jpg",
                new BigDecimal("1299.99"),
                4.7,
                "Smartphones",
                createSpecs("Storage", "512GB", "Color", "Titanium Gray", 
                           "Screen", "6.8-inch Dynamic AMOLED 2X")
            ));

            repository.save(createProductEntity(
                "Google Pixel 8 Pro",
                "Google's flagship with advanced AI photography features",
                "https://example.com/pixel8pro.jpg",
                new BigDecimal("999.99"),
                4.6,
                "Smartphones",
                createSpecs("Storage", "128GB", "Color", "Obsidian", 
                           "Processor", "Google Tensor G3")
            ));

            // Laptops
            repository.save(createProductEntity(
                "MacBook Pro 16-inch M3 Max",
                "Professional laptop with M3 Max chip for demanding workflows",
                "https://example.com/macbookpro16.jpg",
                new BigDecimal("3499.99"),
                4.9,
                "Laptops",
                createSpecs("Processor", "Apple M3 Max", "RAM", "48GB", 
                           "Storage", "1TB SSD", "Screen", "16.2-inch Liquid Retina XDR")
            ));

            repository.save(createProductEntity(
                "Dell XPS 15",
                "High-performance Windows laptop with stunning OLED display",
                "https://example.com/dellxps15.jpg",
                new BigDecimal("2199.99"),
                4.6,
                "Laptops",
                createSpecs("Processor", "Intel Core i7-13700H", "RAM", "32GB DDR5", 
                           "Storage", "1TB NVMe SSD")
            ));

            // Tablets
            repository.save(createProductEntity(
                "iPad Pro 12.9-inch M2",
                "Professional tablet with M2 chip and Liquid Retina XDR display",
                "https://example.com/ipadpro.jpg",
                new BigDecimal("1099.99"),
                4.8,
                "Tablets",
                createSpecs("Processor", "Apple M2", "Storage", "256GB", 
                           "Screen", "12.9-inch Liquid Retina XDR")
            ));

            // Headphones
            repository.save(createProductEntity(
                "Sony WH-1000XM5",
                "Industry-leading noise canceling wireless headphones",
                "https://example.com/sonywh1000xm5.jpg",
                new BigDecimal("399.99"),
                4.8,
                "Headphones",
                createSpecs("Type", "Over-Ear", "Noise Canceling", "Yes", 
                           "Battery Life", "30 hours")
            ));

            repository.save(createProductEntity(
                "AirPods Pro 2nd Gen",
                "Premium wireless earbuds with adaptive ANC",
                "https://example.com/airpodspro2.jpg",
                new BigDecimal("249.99"),
                4.7,
                "Headphones",
                createSpecs("Type", "In-Ear", "Noise Canceling", "Adaptive", 
                           "Chip", "Apple H2")
            ));

            // Smartwatches
            repository.save(createProductEntity(
                "Apple Watch Series 9",
                "Advanced health and fitness smartwatch",
                "https://example.com/applewatch9.jpg",
                new BigDecimal("399.99"),
                4.7,
                "Smartwatches",
                createSpecs("Display", "1.9-inch Always-On Retina", "Processor", "S9 SiP", 
                           "Health Features", "ECG, Blood Oxygen")
            ));

            repository.save(createProductEntity(
                "Garmin Fenix 7X Solar",
                "Rugged multisport GPS smartwatch with solar charging",
                "https://example.com/garminfenix7x.jpg",
                new BigDecimal("899.99"),
                4.8,
                "Smartwatches",
                createSpecs("Display", "1.4-inch MIP", "Battery Life", "28 days (solar)", 
                           "GPS", "Multi-band")
            ));

            long count = repository.count();
            logger.info("✅ Database seeded successfully with {} products", count);
            logger.info("📊 Products by category:");
            logger.info("   - Smartphones: {}", repository.findByCategory("Smartphones").size());
            logger.info("   - Laptops: {}", repository.findByCategory("Laptops").size());
            logger.info("   - Tablets: {}", repository.findByCategory("Tablets").size());
            logger.info("   - Headphones: {}", repository.findByCategory("Headphones").size());
            logger.info("   - Smartwatches: {}", repository.findByCategory("Smartwatches").size());
        };
    }

    private ProductEntity createProductEntity(String name, String description, String imageUrl,
                                             BigDecimal price, Double rating, String category,
                                             Map<String, String> specifications) {
        ProductEntity entity = new ProductEntity();
        entity.setName(name);
        entity.setDescription(description);
        entity.setImageUrl(imageUrl);
        entity.setPrice(price);
        entity.setRating(rating);
        entity.setCategory(category);
        entity.setInStock(true);
        entity.setSpecifications(specifications);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return entity;
    }

    private Map<String, String> createSpecs(String... keyValues) {
        Map<String, String> specs = new HashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            specs.put(keyValues[i], keyValues[i + 1]);
        }
        return specs;
    }
}