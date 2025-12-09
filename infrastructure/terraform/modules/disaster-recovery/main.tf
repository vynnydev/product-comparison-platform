# ============================================
# DISASTER RECOVERY MODULE
# Backup, Multi-AZ, Failover
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  tags = {
    Name        = "${var.project_name}-${var.environment}-disaster-recovery"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Module      = "disaster-recovery"
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}