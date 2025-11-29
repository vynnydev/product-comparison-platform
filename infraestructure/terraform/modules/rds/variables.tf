variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security groups permitidos"
  type        = list(string)
  default     = []
}

variable "db_instance_class" {
  description = "Classe da instância RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Nome do database"
  type        = string
  default     = "productdb"
}

variable "db_username" {
  description = "Master username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Master password"
  type        = string
  sensitive   = true
}

variable "allocated_storage" {
  description = "Storage alocado (GB)"
  type        = number
  default     = 20
}

variable "backup_retention_period" {
  description = "Período de retenção de backup (dias)"
  type        = number
  default     = 7
}

variable "multi_az" {
  description = "Enable Multi-AZ"
  type        = bool
  default     = false
}