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

variable "subnet_ids" {
  description = "IDs das subnets privadas"
  type        = list(string)
}

variable "broker_instance_type" {
  description = "Tipo de instância do broker"
  type        = string
  default     = "mq.t3.micro"
}

variable "broker_username" {
  description = "Username do broker"
  type        = string
  default     = "admin"
}

variable "broker_password" {
  description = "Password do broker"
  type        = string
  sensitive   = true
}

variable "allowed_security_group_ids" {
  description = "Security groups que podem acessar o broker"
  type        = list(string)
  default     = []
}