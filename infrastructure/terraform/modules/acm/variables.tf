variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the certificate"
  type        = string
}

variable "route53_zone_id" {
  description = "Route 53 Hosted Zone ID for DNS validation"
  type        = string
}