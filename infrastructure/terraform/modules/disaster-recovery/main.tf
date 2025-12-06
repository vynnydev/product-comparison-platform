# ============================================
# DISASTER RECOVERY MODULE
# Backup, Multi-AZ, Failover
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}