product-comparison-api/
│
├─backend/
├── src/
│   ├── main/
│   │   ├── java/com/hackerrank/sample/
│   │   │   │
│   │   │   ├── 🟡 domain/                           # CAMADA MAIS INTERNA (Enterprise Business Rules)
│   │   │   │   ├── model/
│   │   │   │   │   └── Product.java                 # Aggregate Root - Entidade pura
│   │   │   │   │
│   │   │   │   ├── valueobject/                     # Value Objects (DDD)
│   │   │   │   │   ├── Money.java                   # Encapsula Price
│   │   │   │   │   ├── Rating.java                  # Encapsula Rating (0-5)
│   │   │   │   │   └── ProductName.java             # Encapsula Name com validações
│   │   │   │   │
│   │   │   │   ├── repository/                      # Ports (Interfaces)
│   │   │   │   │   └── ProductRepository.java       # Interface pura - Port
│   │   │   │   │
│   │   │   │   └── exception/                       # Domain Exceptions
│   │   │   │       ├── DomainException.java         # Base exception
│   │   │   │       ├── ProductNotFoundException.java
│   │   │   │       ├── DuplicateProductException.java
│   │   │   │       └── InvalidProductException.java
│   │   │   │
│   │   │   ├── 🟠 usecase/                          # CASOS DE USO (Application Business Rules)
│   │   │   │   ├── CreateProductUseCase.java        # UC: Criar produto
│   │   │   │   ├── GetProductByIdUseCase.java       # UC: Buscar por ID
│   │   │   │   ├── GetAllProductsUseCase.java       # UC: Listar todos
│   │   │   │   ├── UpdateProductUseCase.java        # UC: Atualizar produto
│   │   │   │   ├── DeleteProductUseCase.java        # UC: Deletar por ID
│   │   │   │   ├── DeleteAllProductsUseCase.java    # UC: Deletar todos
│   │   │   │   └── SearchProductsUseCase.java       # UC: Buscar/Filtrar
│   │   │   │
│   │   │   ├── 🟢 adapter/                          # ADAPTERS (Interface Adapters)
│   │   │   │   │
│   │   │   │   ├── input/                           # DRIVING ADAPTERS (Primary)
│   │   │   │   │   ├── rest/
│   │   │   │   │   │   ├── ProductController.java   # REST Controller
│   │   │   │   │   │   └── exception/
│   │   │   │   │   │       └── GlobalExceptionHandler.java
│   │   │   │   │   │
│   │   │   │   │   └── dto/                         # DTOs de Request/Response
│   │   │   │   │       ├── ProductRequestDTO.java   # Input DTO
│   │   │   │   │       └── ProductResponseDTO.java  # Output DTO
│   │   │   │   │
│   │   │   │   ├── output/                          # DRIVEN ADAPTERS (Secondary)
│   │   │   │   │   └── persistence/
│   │   │   │   │       ├── ProductRepositoryAdapter.java  # Implementa Port
│   │   │   │   │       ├── ProductJpaRepository.java      # Spring Data JPA
│   │   │   │   │       └── entity/
│   │   │   │   │           └── ProductEntity.java         # JPA Entity
│   │   │   │   │
│   │   │   │   └── mapper/                          # Mappers entre camadas
│   │   │   │       └── ProductMapper.java           # Converte Domain↔DTO↔Entity
│   │   │   │
│   │   │   ├── 🔵 config/                           # CONFIGURATION (Frameworks & Drivers)
│   │   │   │   ├── UseCaseConfiguration.java        # Beans dos Use Cases
│   │   │   │   ├── OpenApiConfig.java               # Swagger config
│   │   │   │   ├── CorsConfig.java                  # CORS config
│   │   │   │   └── DatabaseSeeder.java              # Data seeder
│   │   │   │
│   │   │   └── Application.java                     # Spring Boot Main
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/com/hackerrank/sample/
│           ├── ProductServiceTest.java              # Testes unitários Use Cases
│           └── ProductControllerIntegrationTest.java # Testes de integração
│
├ pom.xml
├ Dockerfile
├ docker-compose.yml
├ .gitignore
└ README.md