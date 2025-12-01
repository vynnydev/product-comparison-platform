variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, prod)"
  type        = string
}

variable "image_tag_mutability" {
  description = "Tag mutability (MUTABLE ou IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Escanear imagens no push"
  type        = bool
  default     = true
}

variable "lifecycle_policy_count" {
  description = "Número de imagens a manter"
  type        = number
  default     = 10
}

variable "encryption_type" {
  description = "Tipo de criptografia (AES256 ou KMS)"
  type        = string
  default     = "AES256"
}