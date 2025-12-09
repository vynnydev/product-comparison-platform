# ============================================
# IAM ROLES FOR SECURITY SERVICES
# Roles para os pods de segurança no K8s
# ============================================

# ============================================
# LOCALS
# ============================================
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  # Extrair o ID do OIDC da URL (remove https://)
  oidc_provider_id = replace(var.eks_oidc_issuer_url, "https://", "")
  
  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Module      = "security-iam"
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# OIDC PROVIDER DATA
# # ============================================
# data "aws_iam_openid_connect_provider" "eks" {
#   url = var.eks_oidc_issuer_url
# }

# ============================================
# ROLE: Security Dashboard (Grafana)
# ============================================
resource "aws_iam_role" "security_dashboard" {
  name = "${local.name_prefix}-security-dashboard-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${local.oidc_provider_id}:sub" = "system:serviceaccount:..."
            "${local.oidc_provider_id}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-security-dashboard-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy" "security_dashboard" {
  name = "${local.name_prefix}-security-dashboard-policy"
  role = aws_iam_role.security_dashboard.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchReadOnly"
        Effect = "Allow"
        Action = [
          "cloudwatch:DescribeAlarmsForMetric",
          "cloudwatch:DescribeAlarmHistory",
          "cloudwatch:DescribeAlarms",
          "cloudwatch:ListMetrics",
          "cloudwatch:GetMetricData",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetInsightRuleReport"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchLogsReadOnly"
        Effect = "Allow"
        Action = [
          "logs:DescribeLogGroups",
          "logs:GetLogGroupFields",
          "logs:StartQuery",
          "logs:StopQuery",
          "logs:GetQueryResults",
          "logs:GetLogEvents"
        ]
        Resource = "*"
      },
      {
        Sid    = "WAFReadOnly"
        Effect = "Allow"
        Action = [
          "wafv2:GetWebACL",
          "wafv2:ListWebACLs",
          "wafv2:GetSampledRequests"
        ]
        Resource = "*"
      },
      {
        Sid    = "GuardDutyReadOnly"
        Effect = "Allow"
        Action = [
          "guardduty:GetFindings",
          "guardduty:ListFindings",
          "guardduty:GetFindingsStatistics"
        ]
        Resource = "*"
      },
      {
        Sid    = "SecurityHubReadOnly"
        Effect = "Allow"
        Action = [
          "securityhub:GetFindings",
          "securityhub:GetInsightResults",
          "securityhub:GetInsights"
        ]
        Resource = "*"
      }
    ]
  })
}

# ============================================
# ROLE: GuardDuty Events Processor
# ============================================
resource "aws_iam_role" "guardduty_events" {
  name = "${local.name_prefix}-guardduty-events-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:security:guardduty-events-sa"
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-guardduty-events-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy" "guardduty_events" {
  name = "${local.name_prefix}-guardduty-events-policy"
  role = aws_iam_role.guardduty_events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "GuardDutyAccess"
        Effect = "Allow"
        Action = [
          "guardduty:ListDetectors",
          "guardduty:ListFindings",
          "guardduty:GetFindings",
          "guardduty:GetDetector",
          "guardduty:GetFindingsStatistics"
        ]
        Resource = "*"
      },
      {
        Sid    = "WAFUpdateIPSet"
        Effect = "Allow"
        Action = [
          "wafv2:UpdateIPSet",
          "wafv2:GetIPSet"
        ]
        Resource = "arn:aws:wafv2:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:regional/ipset/*"
      }
    ]
  })
}

# ============================================
# ROLE: WAF Exporter
# ============================================
resource "aws_iam_role" "waf_exporter" {
  name = "${local.name_prefix}-waf-exporter-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:security:waf-exporter-sa"
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-waf-exporter-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy" "waf_exporter" {
  name = "${local.name_prefix}-waf-exporter-policy"
  role = aws_iam_role.waf_exporter.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetMetricData",
          "cloudwatch:ListMetrics"
        ]
        Resource = "*"
      },
      {
        Sid    = "WAFReadOnly"
        Effect = "Allow"
        Action = [
          "wafv2:GetWebACL",
          "wafv2:ListWebACLs",
          "wafv2:GetSampledRequests"
        ]
        Resource = "*"
      }
    ]
  })
}

# ============================================
# ROLE: Shield Exporter
# ============================================
resource "aws_iam_role" "shield_exporter" {
  name = "${local.name_prefix}-shield-exporter-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:security:shield-exporter-sa"
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-shield-exporter-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy" "shield_exporter" {
  name = "${local.name_prefix}-shield-exporter-policy"
  role = aws_iam_role.shield_exporter.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetMetricData",
          "cloudwatch:ListMetrics"
        ]
        Resource = "*"
      },
      {
        Sid    = "ShieldReadOnly"
        Effect = "Allow"
        Action = [
          "shield:DescribeAttack",
          "shield:DescribeProtection",
          "shield:ListAttacks",
          "shield:ListProtections"
        ]
        Resource = "*"
      }
    ]
  })
}

# ============================================
# ROLE: Disaster Recovery Controller
# ============================================
resource "aws_iam_role" "disaster_recovery" {
  name = "${local.name_prefix}-disaster-recovery-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:security:disaster-recovery-sa"
            "${replace(var.eks_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${local.name_prefix}-disaster-recovery-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy" "disaster_recovery" {
  name = "${local.name_prefix}-disaster-recovery-policy"
  role = aws_iam_role.disaster_recovery.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "TerraformStateAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.terraform_state_bucket}",
          "arn:aws:s3:::${var.terraform_state_bucket}/*"
        ]
      },
      {
        Sid    = "DynamoDBLock"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/terraform-locks"
      },
      {
        Sid    = "EC2Describe"
        Effect = "Allow"
        Action = [
          "ec2:Describe*"
        ]
        Resource = "*"
      },
      {
        Sid    = "RDSDescribe"
        Effect = "Allow"
        Action = [
          "rds:Describe*",
          "rds:ListTagsForResource"
        ]
        Resource = "*"
      },
      {
        Sid    = "EKSDescribe"
        Effect = "Allow"
        Action = [
          "eks:Describe*",
          "eks:List*"
        ]
        Resource = "*"
      },
      {
        Sid    = "SNSPublish"
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = "*"
      }
    ]
  })
}

# ============================================
# COST EXPORTER ROLE (IRSA)
# ============================================
resource "aws_iam_role" "cost_exporter" {
  name = "${local.name_prefix}-cost-exporter-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.eks_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${local.oidc_provider_id}:sub" = "system:serviceaccount:finops:cost-exporter-sa"
            "${local.oidc_provider_id}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "cost_exporter" {
  name = "${local.name_prefix}-cost-exporter-policy"
  role = aws_iam_role.cost_exporter.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CostExplorerAccess"
        Effect = "Allow"
        Action = [
          "ce:GetCostAndUsage",
          "ce:GetCostForecast",
          "ce:GetDimensionValues",
          "ce:GetTags",
          "ce:GetAnomalies",
          "ce:GetAnomalyMonitors",
          "ce:GetAnomalySubscriptions"
        ]
        Resource = "*"
      },
      {
        Sid    = "BudgetsAccess"
        Effect = "Allow"
        Action = [
          "budgets:ViewBudget",
          "budgets:DescribeBudgets"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "FinOps/Costs"
          }
        }
      }
    ]
  })
}