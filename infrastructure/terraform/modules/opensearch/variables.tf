variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID da VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block da VPC"
  type        = string
}

variable "subnet_ids" {
  description = "IDs das subnets para o OpenSearch"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security groups permitidos para acessar o OpenSearch"
  type        = list(string)
  default     = []
}

# Cluster Configuration
variable "engine_version" {
  description = "Versão do OpenSearch"
  type        = string
  default     = "OpenSearch_2.11"
}

variable "instance_type" {
  description = "Tipo de instância"
  type        = string
  default     = "t3.small.search"  # Menor instância para dev
}

variable "instance_count" {
  description = "Número de instâncias (data nodes)"
  type        = number
  default     = 1  # 1 para dev, 2+ para prod
}

variable "dedicated_master_enabled" {
  description = "Habilitar master nodes dedicados"
  type        = bool
  default     = false  # true para prod com 3+ data nodes
}

variable "dedicated_master_type" {
  description = "Tipo de instância para master nodes"
  type        = string
  default     = "t3.small.search"
}

# Storage
variable "volume_type" {
  description = "Tipo de volume EBS"
  type        = string
  default     = "gp3"
}

variable "volume_size" {
  description = "Tamanho do volume em GB"
  type        = number
  default     = 20  # Mínimo para dev
}

variable "iops" {
  description = "IOPS para gp3"
  type        = number
  default     = 3000
}

variable "throughput" {
  description = "Throughput para gp3 (MB/s)"
  type        = number
  default     = 125
}

# Security
variable "fine_grained_access_enabled" {
  description = "Habilitar Fine-Grained Access Control"
  type        = bool
  default     = true
}

variable "master_user_name" {
  description = "Username do master user"
  type        = string
  default     = "admin"
}

variable "master_user_password" {
  description = "Password do master user (min 8 chars, upper, lower, number, special)"
  type        = string
  sensitive   = true
}

# Logging
variable "enable_logging" {
  description = "Habilitar logging no CloudWatch"
  type        = bool
  default     = false  # true para prod
}

variable "enable_auto_tune" {
  description = "Habilitar Auto-Tune (não suportado em t2/t3)"
  type        = bool
  default     = false  # false para t3, true para r5/r6g/m5/m6g
}