variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
}

variable "vpc_id" {
  description = "ID da VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs das subnets privadas"
  type        = list(string)
}

variable "cluster_role_arn" {
  description = "ARN do role do cluster"
  type        = string
}

variable "node_role_arn" {
  description = "ARN do role dos nodes"
  type        = string
}

variable "kubernetes_version" {
  description = "Versão do Kubernetes"
  type        = string
  default     = "1.29"
}

variable "node_instance_types" {
  description = "Tipos de instância dos nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

# ============================================
# NODE SCALING - UPDATED FOR MORE CAPACITY
# ============================================
# Previous: 2 nodes (8GB RAM, ~34 pods)
# New: 3 nodes (12GB RAM, ~51 pods)
# This provides more pod capacity and better resilience

variable "desired_size" {
  description = "Número desejado de nodes"
  type        = number
  default     = 3  # Changed from 2 to 3
}

variable "min_size" {
  description = "Número mínimo de nodes"
  type        = number
  default     = 2  # Changed from 1 to 2 for HA
}

variable "max_size" {
  description = "Número máximo de nodes"
  type        = number
  default     = 5  # Changed from 4 to 5 for auto-scaling headroom
}

# ============================================
# CAPACITY SUMMARY:
# ============================================
# With 3x t3.medium nodes:
# - Total RAM: ~12 GB (usable ~9-10 GB)
# - Total Pods: ~51 (17 per node)
# - Total CPU: ~6 vCPUs
# - Cost: ~$90/month
#
# This is enough for:
# - SonarQube + PostgreSQL
# - Prometheus + Grafana + Loki
# - ArgoCD
# - Product Service + AI Service
# - Future: Elasticsearch, Redis, Frontend
# ============================================