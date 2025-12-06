variable "project_name" {
  description = "Nome do projeto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

# ============================================
# DOMAIN & SSL
# ============================================
variable "domain_name" {
  description = "Custom domain name (ex: app.cognitiva.solutions)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ARN do certificado ACM (us-east-1 obrigatório para CloudFront)"
  type        = string
  default     = ""
}

# ============================================
# ALB ORIGIN (para API/SSR)
# ============================================
variable "alb_dns_name" {
  description = "DNS name do ALB (para rotear /api/* requests)"
  type        = string
  default     = ""
}

# ============================================
# DISTRIBUTION SETTINGS
# ============================================
variable "price_class" {
  description = "Price class do CloudFront"
  type        = string
  default     = "PriceClass_100"
}

# ============================================
# GEO RESTRICTIONS
# ============================================
variable "geo_restriction_type" {
  description = "Tipo de restrição geográfica (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "Lista de países para whitelist/blacklist (códigos ISO)"
  type        = list(string)
  default     = []
}

# ============================================
# SECURITY
# ============================================
variable "web_acl_id" {
  description = "ID do WAF Web ACL (opcional)"
  type        = string
  default     = null
}

# ============================================
# LOGGING
# ============================================
variable "enable_logging" {
  description = "Habilitar logging de acessos"
  type        = bool
  default     = false
}