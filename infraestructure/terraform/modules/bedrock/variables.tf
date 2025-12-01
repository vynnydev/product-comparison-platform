# ============================================
# BEDROCK MODULE VARIABLES
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

# ============================================
# BEDROCK MODEL CONFIGURATION
# ============================================

variable "bedrock_model_id" {
  description = "Bedrock model ID to use"
  type        = string
  default     = "anthropic.claude-3-5-sonnet-20241022-v2:0"

  validation {
    condition = contains([
      "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "anthropic.claude-3-sonnet-20240229-v1:0",
      "anthropic.claude-3-haiku-20240307-v1:0",
      "anthropic.claude-instant-v1",
      "amazon.titan-text-express-v1",
      "amazon.titan-text-lite-v1",
      "meta.llama3-8b-instruct-v1:0",
      "meta.llama3-70b-instruct-v1:0"
    ], var.bedrock_model_id)
    error_message = "Invalid Bedrock model ID. Please use a supported model."
  }
}

variable "allowed_models" {
  description = "List of additional Bedrock model IDs allowed"
  type        = list(string)
  default     = []
}

# ============================================
# EKS IRSA CONFIGURATION
# ============================================

variable "oidc_provider_arn" {
  description = "ARN of the EKS OIDC provider"
  type        = string
}

variable "k8s_namespace" {
  description = "Kubernetes namespace for the service account"
  type        = string
  default     = "product-platform"
}

variable "k8s_service_account" {
  description = "Kubernetes service account name"
  type        = string
  default     = "ai-service-sa"
}

# ============================================
# LOGGING CONFIGURATION
# ============================================

variable "enable_logging" {
  description = "Enable CloudWatch logging for Bedrock"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}

# ============================================
# RATE LIMITING (for cost control)
# ============================================

variable "max_tokens_per_minute" {
  description = "Maximum tokens per minute (for documentation/monitoring)"
  type        = number
  default     = 100000
}

variable "max_requests_per_minute" {
  description = "Maximum requests per minute (for documentation/monitoring)"
  type        = number
  default     = 60
}
