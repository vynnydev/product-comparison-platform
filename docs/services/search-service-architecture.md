search-service/
├── src/main/java/com/hackerrank/sample/search/
│   ├── adapter/
│   │   ├── input/
│   │   │   ├── messaging/
│   │   │   │   ├── ProductEventListener.java      # Consome eventos de produto
│   │   │   │   └── AnalysisEventListener.java     # Consome eventos de análise
│   │   │   └── rest/
│   │   │       └── SearchController.java
│   │   └── output/
│   │       └── persistence/
│   │           └── SearchIndexRepository.java
│   ├── config/
│   │   └── RabbitMQConfig.java                    # Configuração das queues
│   ├── domain/
│   │   └── model/
│   │       └── SearchableProduct.java
│   └── usecase/
│       ├── IndexProductUseCase.java
│       └── SearchProductsUseCase.java
├── src/main/resources/
│   ├── application.properties
│   └── application-cloud.properties
├── Dockerfile
└── pom.xml