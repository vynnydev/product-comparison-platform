variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
}

variable "cost_center" {
  description = "Centro de custo"
  type        = string
  default     = "engineering"
}

variable "owner" {
  description = "Owner do projeto"
  type        = string
  default     = "devops"
}

# ============================================
# BUDGET LIMITS
# ============================================

variable "monthly_budget_limit" {
  description = "Limite mensal total (USD)"
  type        = string
  default     = "300"
}

variable "eks_budget_limit" {
  description = "Limite mensal EKS (USD)"
  type        = string
  default     = "100"
}

variable "rds_budget_limit" {
  description = "Limite mensal RDS (USD)"
  type        = string
  default     = "30"
}

variable "ec2_budget_limit" {
  description = "Limite mensal EC2 (USD)"
  type        = string
  default     = "80"
}

variable "data_transfer_budget_limit" {
  description = "Limite mensal Data Transfer (USD)"
  type        = string
  default     = "20"
}

# ============================================
# ANOMALY DETECTION
# ============================================

variable "anomaly_threshold_amount" {
  description = "Threshold de impacto para alertas de anomalia (USD)"
  type        = string
  default     = "10"
}

# ============================================
# NOTIFICATIONS
# ============================================

variable "alert_emails" {
  description = "Emails para alertas"
  type        = list(string)
  default     = []
}

variable "slack_webhook_url" {
  description = "Slack webhook URL"
  type        = string
  default     = ""
  sensitive   = true
}

variable "discord_webhook_url" {
  description = "Discord webhook URL"
  type        = string
  default     = ""
  sensitive   = true
}