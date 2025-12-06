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
  additional_databases = ["aidb", "searchdb"]

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

# ============================================
# ELASTICACHE (REDIS) - CACHE
# ============================================
module "elasticache" {
  source = "./modules/elasticache"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = var.vpc_cidr
  subnet_ids   = module.vpc.private_subnet_ids

  # Configuração para DEV (economia)
  node_type          = "cache.t3.micro"  # Free tier
  num_cache_clusters = 1                  # Sem replica para dev
  redis_version      = "7.1"

  # Segurança
  transit_encryption_enabled = false  # true para prod
  snapshot_retention_limit   = 0      # 7 para prod

  allowed_security_group_ids = [module.eks.node_security_group_id]
}

# ============================================
# OPENSEARCH - BUSCA
# ============================================
module "opensearch" {
  source = "./modules/opensearch"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = var.vpc_cidr
  subnet_ids   = module.vpc.private_subnet_ids

  # Configuração para DEV (economia)
  instance_type            = "t3.small.search"  # Menor instância
  instance_count           = 1                   # Single node para dev
  volume_size              = 20                  # GB mínimo
  dedicated_master_enabled = false               # true para prod

  # Segurança
  fine_grained_access_enabled = true
  master_user_name            = "admin"
  master_user_password        = var.opensearch_password

  # Logging
  enable_logging = false  # true para prod

  allowed_security_group_ids = [module.eks.node_security_group_id]
}

# ============================================
# CLOUDFRONT CDN - FRONTEND
# ============================================
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name = var.project_name
  environment  = var.environment

  # Domain & SSL - sem custom domain por enquanto
  domain_name         = ""
  acm_certificate_arn = ""

  # ALB para API (deixar vazio por enquanto)
  alb_dns_name = ""

  # Distribution settings
  price_class = "PriceClass_100"

  # Logging (desabilitado para dev)
  enable_logging = false
}

# ============================================
# 🛡️ WAF MODULE
# ============================================
module "waf" {
  count  = var.enable_waf ? 1 : 0
  source = "./modules/waf"

  project_name = var.project_name
  environment  = var.environment
  scope        = var.waf_scope

  # Rate limiting
  rate_limit = var.waf_rate_limit

  # IP Lists
  blocked_countries = var.waf_blocked_countries
  whitelisted_ips   = var.waf_whitelisted_ips
  blocked_ips       = var.waf_blocked_ips

  # Logging
  enable_logging     = var.waf_enable_logging
  log_retention_days = var.waf_log_retention_days

  # Alarms
  enable_alarms              = true
  blocked_requests_threshold = var.waf_blocked_requests_threshold
  alarm_sns_topic_arn        = var.enable_disaster_recovery ? module.disaster_recovery[0].sns_topic_arn : ""

  # Custom rules
  enable_custom_rules = true
}

# ============================================
# 🔍 GUARDDUTY MODULE
# ============================================
module "guardduty" {
  count  = var.enable_guardduty ? 1 : 0
  source = "./modules/guardduty"

  project_name = var.project_name
  environment  = var.environment

  finding_publishing_frequency = var.guardduty_finding_publishing_frequency
  enable_s3_protection         = var.guardduty_enable_s3_protection
  enable_eks_protection        = var.guardduty_enable_eks_protection
  enable_malware_protection    = var.guardduty_enable_malware_protection

  min_severity_for_notification = var.guardduty_min_severity_notification
  
  # Adicionar esta linha:
  enable_sns_notifications = var.enable_disaster_recovery
  sns_topic_arn            = var.enable_disaster_recovery ? module.disaster_recovery[0].sns_topic_arn : ""

  enable_alarms = true
}

# ============================================
# 🛡️ SECURITY HUB MODULE
# ============================================
module "security_hub" {
  count  = var.enable_security_hub ? 1 : 0
  source = "./modules/security-hub"

  project_name = var.project_name
  environment  = var.environment

  enable_aws_foundational      = var.security_hub_enable_aws_foundational
  enable_cis_benchmark         = var.security_hub_enable_cis_benchmark
  enable_pci_dss               = var.security_hub_enable_pci_dss
  enable_guardduty_integration = var.enable_guardduty

  severity_labels_for_notification = ["CRITICAL", "HIGH"]
  
  # Adicionar estas linhas:
  enable_sns_notifications = var.enable_disaster_recovery
  sns_topic_arn            = var.enable_disaster_recovery ? module.disaster_recovery[0].sns_topic_arn : ""

  depends_on = [module.guardduty]
}

# ============================================
# 🆘 DISASTER RECOVERY MODULE
# ============================================
module "disaster_recovery" {
  count  = var.enable_disaster_recovery ? 1 : 0
  source = "./modules/disaster-recovery"

  project_name = var.project_name
  environment  = var.environment

  # Backup settings
  backup_cold_storage_after = var.dr_backup_cold_storage_after
  backup_delete_after       = var.dr_backup_delete_after

  # Resources to backup
  rds_arn = module.rds.db_instance_arn

  # Notifications
  alert_emails      = var.dr_alert_emails
  slack_webhook_url = var.dr_slack_webhook_url

  # Monitoring
  rds_identifier         = module.rds.db_instance_id
  rds_max_connections    = 100
  eks_cluster_name       = module.eks.cluster_name
  eks_min_nodes          = var.node_min_size
  elasticache_cluster_id = module.elasticache.replication_group_id
}

# ============================================
# 🔐 SECURITY IAM MODULE
# ============================================
module "security_iam" {
  source = "./modules/security-iam"

  project_name           = var.project_name
  environment            = var.environment
  eks_oidc_issuer_url = module.eks.oidc_issuer_url
  terraform_state_bucket = var.terraform_state_bucket
}

# ============================================
# 💰 FINOPS MODULE
# ============================================
module "finops" {
  count  = var.enable_finops ? 1 : 0
  source = "./modules/finops"

  project_name = var.project_name
  environment  = var.environment
  cost_center  = var.finops_cost_center
  owner        = var.finops_owner

  # Budget limits
  monthly_budget_limit       = var.finops_monthly_budget_limit
  eks_budget_limit           = var.finops_eks_budget_limit
  rds_budget_limit           = var.finops_rds_budget_limit
  ec2_budget_limit           = var.finops_ec2_budget_limit
  data_transfer_budget_limit = var.finops_data_transfer_budget_limit

  # Anomaly detection
  anomaly_threshold_amount = var.finops_anomaly_threshold

  # Notifications
  alert_emails      = var.alert_email_addresses
  slack_webhook_url = var.slack_webhook_url
  discord_webhook_url = var.discord_webhook_url
}