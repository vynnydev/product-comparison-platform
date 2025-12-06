# ============================================
# AWS SECURITY HUB
# Central de segurança e compliance
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

# ============================================
# SECURITY HUB
# ============================================
resource "aws_securityhub_account" "main" {
  enable_default_standards = var.enable_default_standards
  control_finding_generator = "SECURITY_CONTROL"
  auto_enable_controls     = true
}

# ============================================
# SECURITY HUB STANDARDS
# ============================================

# AWS Foundational Security Best Practices
resource "aws_securityhub_standards_subscription" "aws_foundational" {
  count         = var.enable_aws_foundational ? 1 : 0
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"
}

# CIS AWS Foundations Benchmark
resource "aws_securityhub_standards_subscription" "cis" {
  count         = var.enable_cis_benchmark ? 1 : 0
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0"
}

# PCI DSS
resource "aws_securityhub_standards_subscription" "pci_dss" {
  count         = var.enable_pci_dss ? 1 : 0
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/pci-dss/v/3.2.1"
}

# ============================================
# SECURITY HUB PRODUCT INTEGRATIONS
# ============================================

# GuardDuty Integration
resource "aws_securityhub_product_subscription" "guardduty" {
  count       = var.enable_guardduty_integration ? 1 : 0
  depends_on  = [aws_securityhub_account.main]
  product_arn = "arn:aws:securityhub:${data.aws_region.current.name}::product/aws/guardduty"
}

# Inspector Integration
resource "aws_securityhub_product_subscription" "inspector" {
  count       = var.enable_inspector_integration ? 1 : 0
  depends_on  = [aws_securityhub_account.main]
  product_arn = "arn:aws:securityhub:${data.aws_region.current.name}::product/aws/inspector"
}

# Macie Integration
resource "aws_securityhub_product_subscription" "macie" {
  count       = var.enable_macie_integration ? 1 : 0
  depends_on  = [aws_securityhub_account.main]
  product_arn = "arn:aws:securityhub:${data.aws_region.current.name}::product/aws/macie"
}

# ============================================
# EVENTBRIDGE RULE - Security Hub Findings
# ============================================
resource "aws_cloudwatch_event_rule" "security_hub_findings" {
  name        = "${local.name_prefix}-securityhub-findings"
  description = "Capture Security Hub findings"

  event_pattern = jsonencode({
    source      = ["aws.securityhub"]
    detail-type = ["Security Hub Findings - Imported"]
    detail = {
      findings = {
        Severity = {
          Label = var.severity_labels_for_notification
        }
      }
    }
  })

  tags = {
    Name        = "${local.name_prefix}-securityhub-rule"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# EVENTBRIDGE TARGET - SNS
# ============================================
resource "aws_cloudwatch_event_target" "security_hub_sns" {
  count     = var.enable_sns_notifications ? 1 : 0
  
  rule      = aws_cloudwatch_event_rule.security_hub_findings.name
  target_id = "security-hub-to-sns"
  arn       = var.sns_topic_arn

  input_transformer {
    input_paths = {
      title       = "$.detail.findings[0].Title"
      severity    = "$.detail.findings[0].Severity.Label"
      description = "$.detail.findings[0].Description"
      productName = "$.detail.findings[0].ProductName"
    }
    input_template = <<EOF
{
  "source": "security-hub",
  "title": "<title>",
  "severity": "<severity>",
  "description": "<description>",
  "productName": "<productName>"
}
EOF
  }
}

# ============================================
# SECURITY HUB INSIGHT - Custom
# ============================================
resource "aws_securityhub_insight" "critical_findings" {
  depends_on = [aws_securityhub_account.main]
  
  filters {
    severity_label {
      comparison = "EQUALS"
      value      = "CRITICAL"
    }
    
    workflow_status {
      comparison = "EQUALS"
      value      = "NEW"
    }
    
    record_state {
      comparison = "EQUALS"
      value      = "ACTIVE"
    }
  }

  group_by_attribute = "ResourceType"
  name               = "${local.name_prefix}-critical-findings"
}

resource "aws_securityhub_insight" "failed_compliance" {
  filters {
    compliance_status {
      comparison = "EQUALS"
      value      = "FAILED"
    }
    record_state {
      comparison = "EQUALS"
      value      = "ACTIVE"
    }
  }

  # Usar um group_by_attribute válido
  group_by_attribute = "ResourceType"

  name = "${var.project_name}-${var.environment}-failed-compliance"

  depends_on = [aws_securityhub_account.main]
}

data "aws_region" "current" {}