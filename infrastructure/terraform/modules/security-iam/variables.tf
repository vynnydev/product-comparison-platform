variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "eks_oidc_issuer_url" {
  description = "URL do OIDC issuer do EKS"
  type        = string
}

variable "terraform_state_bucket" {
  description = "Nome do bucket S3 do Terraform state"
  type        = string
}

variable "eks_oidc_provider_arn" {
  description = "ARN do OIDC Provider do EKS"
  type        = string
}