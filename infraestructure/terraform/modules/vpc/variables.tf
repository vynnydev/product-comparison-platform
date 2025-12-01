# ============================================
# VPC MODULE - VARIABLES
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "List of availability zones"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway (set to false for dev to save costs)"
  type        = bool
  default     = true
}

variable "create_database_subnets" {
  description = "Create isolated database subnets"
  type        = bool
  default     = true
}