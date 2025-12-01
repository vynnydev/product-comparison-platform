# ============================================
# API GATEWAY MODULE - VARIABLES
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "api_name" {
  description = "Name of the API"
  type        = string
}

variable "api_description" {
  description = "Description of the API"
  type        = string
  default     = "HTTP API Gateway"
}

# Stage Configuration
variable "stage_name" {
  description = "Name of the deployment stage"
  type        = string
  default     = "prod"
}

variable "auto_deploy" {
  description = "Enable auto-deploy for the stage"
  type        = bool
  default     = true
}

# CORS Configuration
variable "cors_allow_origins" {
  description = "Allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cors_allow_methods" {
  description = "Allowed methods for CORS"
  type        = list(string)
  default     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}

variable "cors_allow_headers" {
  description = "Allowed headers for CORS"
  type        = list(string)
  default     = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key"]
}

variable "cors_expose_headers" {
  description = "Exposed headers for CORS"
  type        = list(string)
  default     = []
}

variable "cors_max_age" {
  description = "Max age for CORS preflight cache (seconds)"
  type        = number
  default     = 300
}

variable "cors_allow_credentials" {
  description = "Allow credentials for CORS"
  type        = bool
  default     = false
}

# Throttling Configuration
variable "throttling_burst_limit" {
  description = "Burst limit for throttling"
  type        = number
  default     = 100
}

variable "throttling_rate_limit" {
  description = "Rate limit for throttling (requests per second)"
  type        = number
  default     = 50
}

# Lambda Integrations
variable "lambda_integrations" {
  description = "Map of Lambda integrations"
  type = map(object({
    function_name = string
    invoke_arn    = string
    description   = string
  }))
}

# Routes
variable "routes" {
  description = "Map of API routes"
  type = map(object({
    route_key          = string
    integration_key    = string
    authorization_type = string
    authorizer_id      = string
  }))
}

# Logging
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}