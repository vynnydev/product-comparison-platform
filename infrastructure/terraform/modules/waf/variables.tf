variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "scope" {
  description = "Scope do WAF (REGIONAL ou CLOUDFRONT)"
  type        = string
  default     = "REGIONAL"
}

variable "alb_arn" {
  description = "ARN do ALB para associar o WAF"
  type        = string
  default     = ""
}

variable "rate_limit" {
  description = "Limite de requests por 5 minutos por IP"
  type        = number
  default     = 2000
}

variable "blocked_countries" {
  description = "Lista de países para bloquear (códigos ISO)"
  type        = list(string)
  default     = []
}

variable "whitelisted_ips" {
  description = "Lista de IPs para whitelist (CIDR format)"
  type        = list(string)
  default     = null
}

variable "blocked_ips" {
  description = "Lista de IPs para bloquear (CIDR format)"
  type        = list(string)
  default     = []
}

variable "common_ruleset_excluded_rules" {
  description = "Regras do CommonRuleSet para excluir"
  type        = list(string)
  default     = []
}

variable "enable_logging" {
  description = "Habilitar logging do WAF"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Dias de retenção dos logs"
  type        = number
  default     = 30
}

variable "enable_alarms" {
  description = "Habilitar alarmes CloudWatch"
  type        = bool
  default     = true
}

variable "blocked_requests_threshold" {
  description = "Threshold para alarme de requests bloqueados"
  type        = number
  default     = 1000
}

variable "alarm_sns_topic_arn" {
  description = "ARN do SNS topic para alarmes"
  type        = string
  default     = ""
}

# ============================================
# CUSTOM RULES VARIABLES
# ============================================

variable "enable_custom_rules" {
  description = "Habilitar regras customizadas"
  type        = bool
  default     = true
}

variable "max_body_size" {
  description = "Tamanho máximo do body em bytes (default 8KB)"
  type        = number
  default     = 8192
}

variable "api_rate_limit" {
  description = "Rate limit específico para endpoints /api/*"
  type        = number
  default     = 1000
}