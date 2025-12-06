variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "kms_key_arn" {
  description = "ARN da KMS key para criptografia"
  type        = string
  default     = null
}

# Backup settings
variable "backup_cold_storage_after" {
  description = "Dias antes de mover para cold storage"
  type        = number
  default     = 30
}

variable "backup_delete_after" {
  description = "Dias antes de deletar backup"
  type        = number
  default     = 90
}

variable "dr_region_vault_arn" {
  description = "ARN do vault na região de DR para cross-region backup"
  type        = string
  default     = ""
}

# Resources to backup
variable "rds_arn" {
  description = "ARN do RDS para backup"
  type        = string
  default     = ""
}

variable "efs_arns" {
  description = "Lista de ARNs do EFS para backup"
  type        = list(string)
  default     = []
}

# Notifications
variable "sns_topic_arn" {
  description = "ARN do SNS topic existente (opcional)"
  type        = string
  default     = ""
}

variable "alert_emails" {
  description = "Lista de emails para alertas"
  type        = list(string)
  default     = []
}

variable "slack_webhook_url" {
  description = "URL do Slack webhook para alertas"
  type        = string
  default     = ""
}

# Monitoring
variable "rds_identifier" {
  description = "Identifier do RDS para monitoramento"
  type        = string
  default     = ""
}

variable "rds_max_connections" {
  description = "Máximo de conexões do RDS"
  type        = number
  default     = 100
}

variable "eks_cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
  default     = ""
}

variable "eks_min_nodes" {
  description = "Número mínimo de nodes esperados"
  type        = number
  default     = 2
}

variable "elasticache_cluster_id" {
  description = "ID do cluster ElastiCache"
  type        = string
  default     = ""
}

# COMENTADO - PagerDuty não utilizado
# variable "pagerduty_service_key" {
#   description = "PagerDuty service key para alertas críticos"
#   type        = string
#   default     = ""
#   sensitive   = true
# }