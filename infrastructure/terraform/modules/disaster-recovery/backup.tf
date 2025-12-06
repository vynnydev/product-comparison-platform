# ============================================
# AWS BACKUP - Vault
# ============================================
resource "aws_backup_vault" "main" {
  name        = "${local.name_prefix}-backup-vault"
  kms_key_arn = var.kms_key_arn

  tags = {
    Name        = "${local.name_prefix}-backup-vault"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ============================================
# AWS BACKUP - Plan
# ============================================
resource "aws_backup_plan" "main" {
  name = "${var.project_name}-${var.environment}-backup-plan"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 ? * * *)"

    lifecycle {
      cold_storage_after = var.backup_cold_storage_after  # 30
      delete_after       = var.backup_cold_storage_after + 90  # Deve ser >= cold_storage + 90
    }

    dynamic "copy_action" {
      for_each = var.dr_region_vault_arn != "" ? [1] : []
      content {
        destination_vault_arn = var.dr_region_vault_arn
        lifecycle {
          cold_storage_after = var.backup_cold_storage_after
          delete_after       = var.backup_cold_storage_after + 90
        }
      }
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 ? * SUN *)"

    lifecycle {
      cold_storage_after = 30
      delete_after       = 120  # 30 + 90 = 120
    }
  }

  rule {
    rule_name         = "monthly-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 1 * ? *)"

    lifecycle {
      cold_storage_after = 90
      delete_after       = 365
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-backup-plan"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# AWS BACKUP - Selection (RDS)
# ============================================
resource "aws_backup_selection" "rds" {
  count        = var.rds_arn != "" ? 1 : 0
  name         = "${local.name_prefix}-rds-backup"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = [var.rds_arn]
}

# ============================================
# AWS BACKUP - Selection (EFS)
# ============================================
resource "aws_backup_selection" "efs" {
  count        = length(var.efs_arns) > 0 ? 1 : 0
  name         = "${local.name_prefix}-efs-backup"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  resources = var.efs_arns
}

# ============================================
# AWS BACKUP - Selection by Tags
# ============================================
resource "aws_backup_selection" "tags" {
  name         = "${local.name_prefix}-tag-backup"
  plan_id      = aws_backup_plan.main.id
  iam_role_arn = aws_iam_role.backup.arn

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Backup"
    value = "true"
  }
}

# ============================================
# IAM ROLE - AWS Backup
# ============================================
resource "aws_iam_role" "backup" {
  name = "${local.name_prefix}-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-backup-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

# ============================================
# BACKUP VAULT NOTIFICATIONS
# ============================================
resource "aws_backup_vault_notifications" "main" {
  backup_vault_name   = aws_backup_vault.main.name
  sns_topic_arn       = var.sns_topic_arn != "" ? var.sns_topic_arn : aws_sns_topic.dr_alerts.arn
  backup_vault_events = [
    "BACKUP_JOB_STARTED",
    "BACKUP_JOB_COMPLETED",
    "BACKUP_JOB_FAILED",
    "RESTORE_JOB_STARTED",
    "RESTORE_JOB_COMPLETED",
    "RESTORE_JOB_FAILED",
    "RECOVERY_POINT_MODIFIED"
  ]
}