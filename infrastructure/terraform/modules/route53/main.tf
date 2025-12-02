# ============================================
# ROUTE 53 - DNS MANAGEMENT
# ============================================

# Hosted Zone for the domain
resource "aws_route53_zone" "main" {
  name    = var.domain_name
  comment = "Managed by Terraform - ${var.project_name}"

  tags = {
    Name        = "${var.project_name}-zone"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# A Record pointing to ALB (will be created after ALB exists)
resource "aws_route53_record" "app" {
  count = var.alb_dns_name != "" ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# Wildcard A Record (*.cognitiva.solutions)
resource "aws_route53_record" "wildcard" {
  count = var.alb_dns_name != "" ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = "*.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}