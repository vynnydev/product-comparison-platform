backend/services/ai-service/
├── src/
│   ├── main/
│   │   ├── java/com/hackerrank/sample/ai/
│   │   │   │
│   │   │   ├── domain/                    # DOMAIN LAYER
│   │   │   │   ├── model/
│   │   │   │   │   ├── ProductAnalysis.java
│   │   │   │   │   ├── SearchEnhancement.java
│   │   │   │   │   └── ProductComparison.java
│   │   │   │   │
│   │   │   │   └── service/
│   │   │   │       └── AIService.java    # Interface (Port)
│   │   │   │
│   │   │   ├── usecase/                   # USE CASES
│   │   │   │   ├── AnalyzeProductUseCase.java
│   │   │   │   ├── EnhanceSearchUseCase.java
│   │   │   │   └── CompareProductsUseCase.java
│   │   │   │
│   │   │   ├── adapter/                   # ADAPTERS
│   │   │   │   ├── input/
│   │   │   │   │   ├── rest/
│   │   │   │   │   │   └── AIController.java
│   │   │   │   │   │
│   │   │   │   │   ├── messaging/
│   │   │   │   │   │   └── ProductEventListener.java
│   │   │   │   │   │
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── ProductAnalysisResponseDTO.java
│   │   │   │   │       ├── SearchEnhancementRequestDTO.java
│   │   │   │   │       └── CompareProductsRequestDTO.java
│   │   │   │   │
│   │   │   │   └── output/
│   │   │   │       └── ai/
│   │   │   │           ├── MockAIAdapter.java
│   │   │   │           └── LambdaAIAdapter.java
│   │   │   │
│   │   │   ├── config/                    # CONFIGURATION
│   │   │   │   └── RabbitMQConfig.java
│   │   │   │
│   │   │   └── AIApplication.java         # Main class
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-local.properties
│   │       └── application-cloud.properties
│   │
│   └── test/
│       └── java/com/hackerrank/sample/ai/
│           └── (testes)
│
├── pom.xml
├── Dockerfile
└── README.md