variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
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
  default     = 2
}

variable "node_min_size" {
  description = "Número mínimo de nodes"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Número máximo de nodes"
  type        = number
  default     = 4
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

variable "tags" {
  description = "Tags adicionais"
  type        = map(string)
  default     = {}
}

# ============================================
# RABBITMQ VARIABLES
# ============================================

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

# ============================================
# RDS VARIABLES
# ============================================

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

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "cognitiva.solutions"
}