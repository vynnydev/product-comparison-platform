# ============================================
# VPC Module - Development Environment
# ============================================
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  azs          = var.availability_zones

  # Development settings (cost optimization)
  enable_nat_gateway      = true   # Set to false to save ~$32/month
  create_database_subnets = true   # Isolated subnets for RDS
}

# ============================================
# ECR Module
# ============================================
module "ecr" {
  source = "./modules/ecr"
  
  project_name = var.project_name
  environment  = var.environment
}

# ============================================
# IAM Module
# ============================================
module "iam" {
  source = "./modules/iam"
  
  project_name = var.project_name
  environment  = var.environment
}

# ============================================
# EKS Module
# ============================================
module "eks" {
  source = "./modules/eks"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  cluster_role_arn   = module.iam.eks_cluster_role_arn
  node_role_arn      = module.iam.eks_node_role_arn
}

# ============================================
# AMAZON MQ (RABBITMQ)
# ============================================
module "amazonmq" {
  source = "./modules/amazonmq"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = var.vpc_cidr
  
  # IMPORTANTE: Usar subnet PÚBLICA para acesso externo
  subnet_ids = module.vpc.public_subnet_ids  # <-- Mudar para public!
  
  allowed_security_group_ids = [module.eks.node_security_group_id]
  
  broker_username     = "admin"
  broker_password     = var.rabbitmq_password
  
  # Habilitar acesso público
  publicly_accessible = true  # <-- Garantir que está true
}

# ============================================
# RDS POSTGRESQL
# ============================================
module "rds" {
  source = "./modules/rds"

  project_name = var.project_name
  environment  = var.environment

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids

  db_instance_class       = "db.t3.micro"
  db_name                 = "productdb"
  db_username             = var.db_username
  db_password             = var.db_password
  allocated_storage       = 20
  backup_retention_period = 7
  multi_az                = false  # true para prod

  vpc_cidr             = "10.0.0.0/16"
  additional_databases = ["aidb"]

  allowed_security_group_ids = [module.eks.node_security_group_id]
}

# ============================================
# LLM Bedrock
# ============================================
module "bedrock" {
  source = "./modules/bedrock"

  project_name      = var.project_name
  environment       = var.environment
  oidc_provider_arn = module.eks.oidc_provider_arn

  k8s_namespace       = "product-platform"
  k8s_service_account = "ai-service-sa"
  bedrock_model_id    = "anthropic.claude-3-5-sonnet-20241022-v2:0"
}

# ============================================
# Lambda AI Service
# ============================================
module "lambda_ai" {
  source = "./modules/lambda"

  project_name  = var.project_name
  environment   = var.environment
  function_name = "ai-service"

  handler     = "handler.lambda_handler"
  runtime     = "python3.11"
  timeout     = 60
  memory_size = 512

  environment_variables = {
    BEDROCK_MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0"
  }

  enable_bedrock   = true
  bedrock_model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"

  tags = local.common_tags
}

# ============================================
# API Gateway for AI Service
# ============================================
module "api_gateway_ai" {
  source = "./modules/api-gateway"

  project_name    = var.project_name
  environment     = var.environment
  api_name        = "ai-api"
  api_description = "API Gateway for AI Service"

  stage_name  = "prod"
  auto_deploy = true

  # CORS Configuration
  cors_allow_origins = ["*"]
  cors_allow_methods = ["GET", "POST", "OPTIONS"]
  cors_allow_headers = ["Content-Type", "Authorization"]

  # Throttling
  throttling_burst_limit = 100
  throttling_rate_limit  = 50

  # Lambda Integration
  lambda_integrations = {
    ai_service = {
      function_name = module.lambda_ai.function_name
      invoke_arn    = module.lambda_ai.invoke_arn
      description   = "AI Service Lambda Integration"
    }
  }

  # Routes
  routes = {
    post_ai = {
      route_key          = "POST /ai"
      integration_key    = "ai_service"
      authorization_type = "NONE"
      authorizer_id      = null
    }
    get_health = {
      route_key          = "GET /ai/health"
      integration_key    = "ai_service"
      authorization_type = "NONE"
      authorizer_id      = null
    }
  }

  tags = local.common_tags
}

# ============================================
# ROUTE 53 - DNS
# ============================================
module "route53" {
  source = "./modules/route53"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name

  # Deixar vazio inicialmente - atualizar depois que o ALB for criado
  alb_dns_name = ""
  alb_zone_id  = ""
}

# ============================================
# ACM - SSL CERTIFICATE
# ============================================
module "acm" {
  source = "./modules/acm"

  project_name    = var.project_name
  environment     = var.environment
  domain_name     = var.domain_name
  route53_zone_id = module.route53.zone_id

  depends_on = [module.route53]
}