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
  description = "IDs das subnets para o Redis"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "Security groups permitidos para acessar o Redis"
  type        = list(string)
  default     = []
}

variable "node_type" {
  description = "Tipo de instância do Redis"
  type        = string
  default     = "cache.t3.micro"  # Free tier eligible
}

variable "num_cache_clusters" {
  description = "Número de nós no cluster (1 = sem replica, 2+ = com failover)"
  type        = number
  default     = 1  # 1 para dev, 2+ para prod
}

variable "redis_version" {
  description = "Versão do Redis"
  type        = string
  default     = "7.1"
}

variable "transit_encryption_enabled" {
  description = "Habilitar TLS para conexões"
  type        = bool
  default     = false  # true para prod
}

variable "auth_token" {
  description = "Token de autenticação (requer transit_encryption_enabled = true)"
  type        = string
  default     = null
  sensitive   = true
}

variable "snapshot_retention_limit" {
  description = "Dias para reter snapshots (0 = desabilitado)"
  type        = number
  default     = 0  # 0 para dev, 7+ para prod
}