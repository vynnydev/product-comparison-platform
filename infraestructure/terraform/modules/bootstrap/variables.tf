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
  description = "Ambiente"
  type        = string
  default     = "dev"
}