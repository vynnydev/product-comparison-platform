# ============================================
# 🌍 GENERAL VARIABLES
# ============================================

variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "aws_secondary_region" {
  description = "Região AWS secundária para DR"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "product-comparison"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# ============================================
# 🌐 NETWORKING VARIABLES
# ============================================

variable "vpc_cidr" {
  description = "CIDR block para VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability Zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "private_subnet_cidrs" {
  description = "CIDRs das subnets privadas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "enable_nat_gateway" {
  description = "Habilitar NAT Gateway"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Usar apenas um NAT Gateway"
  type        = bool
  default     = true
}

# ============================================
# ☸️ EKS VARIABLES
# ============================================

variable "kubernetes_version" {
  description = "Versão do Kubernetes"
  type        = string
  default     = "1.29"
}

variable "node_instance_types" {
  description = "Tipos de instância EC2 para nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Número desejado de nodes"
  type        = number
  default     = 4
}

variable "node_min_size" {
  description = "Número mínimo de nodes"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Número máximo de nodes"
  type        = number
  default     = 6
}

variable "node_disk_size" {
  description = "Tamanho do disco dos nodes (GB)"
  type        = number
  default     = 50
}

variable "cluster_enabled_log_types" {
  description = "Tipos de log do EKS a habilitar"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

# ============================================
# 🗄️ RDS VARIABLES
# ============================================

variable "db_instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Storage alocado (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Storage máximo para autoscaling (GB)"
  type        = number
  default     = 100
}

variable "db_engine_version" {
  description = "Versão do PostgreSQL"
  type        = string
  default     = "15.4"
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "productdb"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "db_multi_az" {
  description = "Habilitar Multi-AZ"
  type        = bool
  default     = false
}

variable "db_backup_retention_period" {
  description = "Período de retenção de backups (dias)"
  type        = number
  default     = 7
}

variable "db_deletion_protection" {
  description = "Proteção contra deleção"
  type        = bool
  default     = false
}

# ============================================
# 🐰 AMAZON MQ (RABBITMQ) VARIABLES
# ============================================

variable "rabbitmq_instance_type" {
  description = "Tipo de instância do RabbitMQ"
  type        = string
  default     = "mq.t3.micro"
}

variable "rabbitmq_engine_version" {
  description = "Versão do RabbitMQ"
  type        = string
  default     = "3.11.20"
}

variable "rabbitmq_username" {
  description = "Amazon MQ RabbitMQ username"
  type        = string
  default     = "admin"
}

variable "rabbitmq_password" {
  description = "Amazon MQ RabbitMQ password"
  type        = string
  sensitive   = true
}

variable "rabbitmq_deployment_mode" {
  description = "Modo de deploy (SINGLE_INSTANCE ou CLUSTER_MULTI_AZ)"
  type        = string
  default     = "SINGLE_INSTANCE"
}

# ============================================
# 🔴 ELASTICACHE (REDIS) VARIABLES
# ============================================

variable "redis_node_type" {
  description = "Tipo de node do Redis"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Número de nodes do Redis"
  type        = number
  default     = 1
}

variable "redis_engine_version" {
  description = "Versão do Redis"
  type        = string
  default     = "7.0"
}

variable "redis_parameter_group_family" {
  description = "Família do parameter group"
  type        = string
  default     = "redis7"
}

variable "redis_auth_token" {
  description = "Token de autenticação do Redis (opcional)"
  type        = string
  default     = null
  sensitive   = true
}

variable "redis_snapshot_retention_limit" {
  description = "Dias de retenção de snapshots"
  type        = number
  default     = 7
}

# ============================================
# 🔍 OPENSEARCH VARIABLES
# ============================================

variable "opensearch_engine_version" {
  description = "Versão do OpenSearch"
  type        = string
  default     = "OpenSearch_2.11"
}

variable "opensearch_instance_type" {
  description = "Tipo de instância do OpenSearch"
  type        = string
  default     = "t3.small.search"
}

variable "opensearch_instance_count" {
  description = "Número de instâncias"
  type        = number
  default     = 1
}

variable "opensearch_volume_size" {
  description = "Tamanho do volume EBS (GB)"
  type        = number
  default     = 20
}

variable "opensearch_master_user" {
  description = "Usuário master do OpenSearch"
  type        = string
  default     = "admin"
}

variable "opensearch_password" {
  description = "Password para OpenSearch master user"
  type        = string
  sensitive   = true
}

# ============================================
# 🌐 ROUTE53 & ACM VARIABLES
# ============================================

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "cognitiva.solutions"
}

variable "create_route53_zone" {
  description = "Criar zona Route53"
  type        = bool
  default     = true
}

variable "subject_alternative_names" {
  description = "SANs para o certificado SSL"
  type        = list(string)
  default     = []
}

# ============================================
# ☁️ CLOUDFRONT VARIABLES
# ============================================

variable "cloudfront_price_class" {
  description = "Price class do CloudFront"
  type        = string
  default     = "PriceClass_100"
}

variable "cloudfront_default_ttl" {
  description = "TTL padrão (segundos)"
  type        = number
  default     = 86400
}

variable "cloudfront_max_ttl" {
  description = "TTL máximo (segundos)"
  type        = number
  default     = 31536000
}

# ============================================
# 🤖 BEDROCK / AI VARIABLES
# ============================================

variable "bedrock_model_id" {
  description = "ID do modelo Bedrock"
  type        = string
  default     = "anthropic.claude-3-5-sonnet-20241022-v2:0"
}

variable "lambda_memory_size" {
  description = "Memória da Lambda de AI (MB)"
  type        = number
  default     = 512
}

variable "lambda_timeout" {
  description = "Timeout da Lambda de AI (segundos)"
  type        = number
  default     = 30
}

# ============================================
# 🛡️ WAF VARIABLES
# ============================================

variable "enable_waf" {
  description = "Habilitar AWS WAF"
  type        = bool
  default     = true
}

variable "waf_scope" {
  description = "Scope do WAF (REGIONAL ou CLOUDFRONT)"
  type        = string
  default     = "REGIONAL"
}

variable "waf_rate_limit" {
  description = "Rate limit do WAF (requests por 5 min por IP)"
  type        = number
  default     = 2000
}

variable "waf_blocked_countries" {
  description = "Lista de países para bloquear (códigos ISO)"
  type        = list(string)
  default     = []
}

variable "waf_whitelisted_ips" {
  description = "IPs para whitelist (CIDR)"
  type        = list(string)
  default     = null
}

variable "waf_blocked_ips" {
  description = "IPs para bloquear (CIDR)"
  type        = list(string)
  default     = []
}

variable "waf_enable_logging" {
  description = "Habilitar logging do WAF"
  type        = bool
  default     = true
}

variable "waf_log_retention_days" {
  description = "Dias de retenção dos logs do WAF"
  type        = number
  default     = 30
}

variable "waf_blocked_requests_threshold" {
  description = "Threshold para alarme de requests bloqueados"
  type        = number
  default     = 500
}

variable "waf_enable_custom_rules" {
  description = "Habilitar regras customizadas do WAF"
  type        = bool
  default     = true
}

variable "waf_max_body_size" {
  description = "Tamanho máximo do body em bytes"
  type        = number
  default     = 8192
}

variable "waf_api_rate_limit" {
  description = "Rate limit específico para endpoints /api/*"
  type        = number
  default     = 1000
}

# ============================================
# 🔍 GUARDDUTY VARIABLES
# ============================================

variable "enable_guardduty" {
  description = "Habilitar AWS GuardDuty"
  type        = bool
  default     = true
}

variable "guardduty_finding_publishing_frequency" {
  description = "Frequência de publicação de findings (FIFTEEN_MINUTES, ONE_HOUR, SIX_HOURS)"
  type        = string
  default     = "FIFTEEN_MINUTES"
}

variable "guardduty_enable_s3_protection" {
  description = "Habilitar proteção S3"
  type        = bool
  default     = true
}

variable "guardduty_enable_eks_protection" {
  description = "Habilitar proteção EKS"
  type        = bool
  default     = true
}

variable "guardduty_enable_malware_protection" {
  description = "Habilitar proteção contra malware"
  type        = bool
  default     = true
}

variable "guardduty_min_severity_notification" {
  description = "Severidade mínima para notificação (1-10)"
  type        = number
  default     = 4
}

# ============================================
# 🛡️ SECURITY HUB VARIABLES
# ============================================

variable "enable_security_hub" {
  description = "Habilitar AWS Security Hub"
  type        = bool
  default     = true
}

variable "security_hub_enable_default_standards" {
  description = "Habilitar standards padrão"
  type        = bool
  default     = false
}

variable "security_hub_enable_aws_foundational" {
  description = "Habilitar AWS Foundational Security Best Practices"
  type        = bool
  default     = true
}

variable "security_hub_enable_cis_benchmark" {
  description = "Habilitar CIS AWS Foundations Benchmark"
  type        = bool
  default     = true
}

variable "security_hub_enable_pci_dss" {
  description = "Habilitar PCI DSS"
  type        = bool
  default     = false
}

variable "security_hub_severity_labels" {
  description = "Labels de severidade para notificação"
  type        = list(string)
  default     = ["CRITICAL", "HIGH"]
}

# ============================================
# 🆘 DISASTER RECOVERY VARIABLES
# ============================================

variable "enable_disaster_recovery" {
  description = "Habilitar módulo de Disaster Recovery"
  type        = bool
  default     = true
}

variable "dr_backup_cold_storage_after" {
  description = "Dias antes de mover backup para cold storage"
  type        = number
  default     = 30
}

variable "dr_backup_delete_after" {
  description = "Dias antes de deletar backup"
  type        = number
  default     = 90
}

variable "dr_cross_region_backup" {
  description = "Habilitar backup cross-region"
  type        = bool
  default     = false
}

variable "dr_region_vault_arn" {
  description = "ARN do vault na região de DR"
  type        = string
  default     = ""
}

variable "dr_alert_emails" {
  description = "Emails para alertas de DR"
  type        = list(string)
  default     = []
}

variable "dr_slack_webhook_url" {
  description = "Slack webhook URL para alertas de Disaster Recovery"
  type        = string
  default     = ""
  sensitive   = true
}

variable "backup_retention_days" {
  description = "Número de dias para reter backups"
  type        = number
  default     = 90
}

variable "backup_cold_storage_after" {
  description = "Dias após os quais mover backup para cold storage"
  type        = number
  default     = 30
}

variable "backup_delete_after" {
  description = "Dias após os quais deletar backup (deve ser >= cold_storage + 90)"
  type        = number
  default     = 120
}

# ============================================
# 🔐 SECURITY IAM VARIABLES
# ============================================

variable "terraform_state_bucket" {
  description = "Nome do bucket S3 para Terraform state"
  type        = string
  default     = "product-comparison-terraform-state"
}

# ============================================
# 📧 NOTIFICATION VARIABLES
# ============================================

variable "slack_webhook_url" {
  description = "Slack webhook URL para notificações"
  type        = string
  default     = ""
  sensitive   = true
}

variable "discord_webhook_url" {
  description = "Discord webhook URL para notificações"
  type        = string
  default     = ""
  sensitive   = true
}

# variable "pagerduty_service_key" {
#   description = "PagerDuty service key"
#   type        = string
#   default     = ""
#   sensitive   = true
# }

variable "alert_emails" {
  description = "Lista de emails para alertas"
  type        = list(string)
  default     = []
}

# ============================================
# 🏷️ TAGS VARIABLES
# ============================================

variable "tags" {
  description = "Tags adicionais para todos os recursos"
  type        = map(string)
  default     = {}
}

variable "enable_cost_tags" {
  description = "Habilitar tags de custo"
  type        = bool
  default     = true
}

# ============================================
# 🔧 FEATURE FLAGS
# ============================================

variable "enable_cloudfront" {
  description = "Habilitar CloudFront CDN"
  type        = bool
  default     = true
}

variable "enable_api_gateway" {
  description = "Habilitar API Gateway"
  type        = bool
  default     = true
}

variable "enable_lambda_ai" {
  description = "Habilitar Lambda de AI"
  type        = bool
  default     = true
}

variable "enable_opensearch" {
  description = "Habilitar OpenSearch"
  type        = bool
  default     = true
}

variable "enable_elasticache" {
  description = "Habilitar ElastiCache (Redis)"
  type        = bool
  default     = true
}

variable "enable_amazonmq" {
  description = "Habilitar Amazon MQ (RabbitMQ)"
  type        = bool
  default     = true
}

# ============================================
# 💰 FINOPS VARIABLES
# ============================================

variable "enable_finops" {
  description = "Habilitar módulo FinOps"
  type        = bool
  default     = true
}

variable "finops_cost_center" {
  description = "Centro de custo"
  type        = string
  default     = "engineering"
}

variable "finops_owner" {
  description = "Owner do projeto para cost allocation"
  type        = string
  default     = "devops"
}

variable "finops_monthly_budget_limit" {
  description = "Limite mensal total (USD)"
  type        = string
  default     = "300"
}

variable "finops_eks_budget_limit" {
  description = "Limite mensal EKS (USD)"
  type        = string
  default     = "100"
}

variable "finops_rds_budget_limit" {
  description = "Limite mensal RDS (USD)"
  type        = string
  default     = "30"
}

variable "finops_ec2_budget_limit" {
  description = "Limite mensal EC2 (USD)"
  type        = string
  default     = "80"
}

variable "finops_data_transfer_budget_limit" {
  description = "Limite mensal Data Transfer (USD)"
  type        = string
  default     = "20"
}

variable "finops_anomaly_threshold" {
  description = "Threshold de anomalia para alertas (USD)"
  type        = string
  default     = "10"
}