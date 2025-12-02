variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the broker"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "List of security group IDs allowed to connect"
  type        = list(string)
  default     = []
}

variable "broker_instance_type" {
  description = "Instance type for the broker"
  type        = string
  default     = "mq.t3.micro"
}

variable "broker_username" {
  description = "Username for RabbitMQ"
  type        = string
  default     = "admin"
}

variable "broker_password" {
  description = "Password for RabbitMQ"
  type        = string
  sensitive   = true
}

# === NOVA VARIÁVEL ===
variable "publicly_accessible" {
  description = "Whether the broker should be publicly accessible (for dev only!)"
  type        = bool
  default     = false
}