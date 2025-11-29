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

variable "desired_size" {
  description = "Número desejado de nodes"
  type        = number
  default     = 2
}

variable "min_size" {
  description = "Número mínimo de nodes"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Número máximo de nodes"
  type        = number
  default     = 4
}