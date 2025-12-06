variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "finding_publishing_frequency" {
  description = "Frequência de publicação de findings (FIFTEEN_MINUTES, ONE_HOUR, SIX_HOURS)"
  type        = string
  default     = "FIFTEEN_MINUTES"
}

variable "enable_s3_protection" {
  description = "Habilitar proteção S3"
  type        = bool
  default     = true
}

variable "enable_eks_protection" {
  description = "Habilitar proteção EKS (audit logs)"
  type        = bool
  default     = true
}

variable "enable_malware_protection" {
  description = "Habilitar proteção contra malware"
  type        = bool
  default     = true
}

variable "min_severity_for_notification" {
  description = "Severidade mínima para notificação (1-10)"
  type        = number
  default     = 4
}

variable "sns_topic_arn" {
  description = "ARN do SNS topic para notificações"
  type        = string
  default     = ""
}

variable "lambda_arn" {
  description = "ARN da Lambda para processamento de findings"
  type        = string
  default     = ""
}

variable "enable_alarms" {
  description = "Habilitar alarmes CloudWatch"
  type        = bool
  default     = true
}

variable "findings_s3_bucket_arn" {
  description = "ARN do bucket S3 para exportar findings"
  type        = string
  default     = ""
}

variable "findings_kms_key_arn" {
  description = "ARN da KMS key para criptografar findings"
  type        = string
  default     = ""
}

variable "enable_sns_notifications" {
  description = "Habilitar notificações via SNS"
  type        = bool
  default     = true
}

# COMENTADO - PagerDuty não utilizado
# variable "pagerduty_service_key" {
#   description = "PagerDuty service key"
#   type        = string
#   default     = ""
#   sensitive   = true
# }