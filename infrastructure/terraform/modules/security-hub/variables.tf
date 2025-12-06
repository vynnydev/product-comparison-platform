variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "enable_default_standards" {
  description = "Habilitar standards padrão"
  type        = bool
  default     = false
}

variable "enable_aws_foundational" {
  description = "Habilitar AWS Foundational Security Best Practices"
  type        = bool
  default     = true
}

variable "enable_cis_benchmark" {
  description = "Habilitar CIS AWS Foundations Benchmark"
  type        = bool
  default     = true
}

variable "enable_pci_dss" {
  description = "Habilitar PCI DSS"
  type        = bool
  default     = false
}

variable "enable_guardduty_integration" {
  description = "Habilitar integração com GuardDuty"
  type        = bool
  default     = true
}

variable "enable_inspector_integration" {
  description = "Habilitar integração com Inspector"
  type        = bool
  default     = false
}

variable "enable_macie_integration" {
  description = "Habilitar integração com Macie"
  type        = bool
  default     = false
}

variable "severity_labels_for_notification" {
  description = "Labels de severidade para notificação"
  type        = list(string)
  default     = ["CRITICAL", "HIGH"]
}

variable "sns_topic_arn" {
  description = "ARN do SNS topic para notificações"
  type        = string
  default     = ""
}

variable "enable_sns_notifications" {
  description = "Habilitar notificações via SNS"
  type        = bool
  default     = true
}