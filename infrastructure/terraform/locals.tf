
# ============================================
# LOCAL VALUES
# ============================================
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Team        = "platform"
    Repository  = "product-comparison"
    CreatedAt   = timestamp()
  }
}