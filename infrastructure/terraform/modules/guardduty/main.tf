# ============================================
# AWS GUARDDUTY - Threat Detection
# Detecção inteligente de ameaças
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

# ============================================
# GUARDDUTY DETECTOR
# ============================================
resource "aws_guardduty_detector" "main" {
  enable = true

  # Frequência de notificação de findings
  finding_publishing_frequency = var.finding_publishing_frequency

  datasources {
    # S3 Protection
    s3_logs {
      enable = var.enable_s3_protection
    }

    # Kubernetes Protection
    kubernetes {
      audit_logs {
        enable = var.enable_eks_protection
      }
    }

    # Malware Protection
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = var.enable_malware_protection
        }
      }
    }
  }

  tags = {
    Name        = "${local.name_prefix}-guardduty"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ============================================
# GUARDDUTY FILTER - High Severity
# ============================================
resource "aws_guardduty_filter" "high_severity" {
  name        = "${local.name_prefix}-high-severity"
  action      = "ARCHIVE"
  detector_id = aws_guardduty_detector.main.id
  rank        = 1

  finding_criteria {
    criterion {
      field  = "severity"
      equals = ["8", "9"]
    }
  }

  tags = {
    Name        = "${local.name_prefix}-high-severity-filter"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# EVENTBRIDGE RULE - GuardDuty Findings
# ============================================
resource "aws_cloudwatch_event_rule" "guardduty_findings" {
  name        = "${local.name_prefix}-guardduty-findings"
  description = "Capture GuardDuty findings"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
    detail = {
      severity = [
        { numeric = [">=", var.min_severity_for_notification] }
      ]
    }
  })

  tags = {
    Name        = "${local.name_prefix}-guardduty-rule"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# EVENTBRIDGE TARGET - SNS
# ============================================
resource "aws_cloudwatch_event_target" "guardduty_sns" {
  count     = var.enable_sns_notifications ? 1 : 0
  
  rule      = aws_cloudwatch_event_rule.guardduty_findings.name
  target_id = "guardduty-to-sns"
  arn       = var.sns_topic_arn

  input_transformer {
    input_paths = {
      severity    = "$.detail.severity"
      type        = "$.detail.type"
      description = "$.detail.description"
      region      = "$.region"
      accountId   = "$.account"
      findingId   = "$.detail.id"
    }
    input_template = <<EOF
{
  "source": "guardduty",
  "severity": <severity>,
  "type": "<type>",
  "description": "<description>",
  "region": "<region>",
  "accountId": "<accountId>",
  "findingId": "<findingId>"
}
EOF
  }
}

# ============================================
# EVENTBRIDGE TARGET - Lambda (opcional)
# ============================================
resource "aws_cloudwatch_event_target" "guardduty_lambda" {
  count     = var.lambda_arn != "" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.guardduty_findings.name
  target_id = "guardduty-to-lambda"
  arn       = var.lambda_arn
}

# ============================================
# CLOUDWATCH ALARM - GuardDuty Findings
# ============================================
resource "aws_cloudwatch_metric_alarm" "guardduty_findings" {
  count               = var.enable_alarms ? 1 : 0
  alarm_name          = "${local.name_prefix}-guardduty-findings"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Invocations"
  namespace           = "AWS/Events"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "GuardDuty findings detected"
  treat_missing_data  = "notBreaching"

  dimensions = {
    RuleName = aws_cloudwatch_event_rule.guardduty_findings.name
  }

  alarm_actions = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name        = "${local.name_prefix}-guardduty-alarm"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# GUARDDUTY PUBLISHING DESTINATION - S3 (opcional)
# ============================================
resource "aws_guardduty_publishing_destination" "s3" {
  count           = var.findings_s3_bucket_arn != "" ? 1 : 0
  detector_id     = aws_guardduty_detector.main.id
  destination_arn = var.findings_s3_bucket_arn
  kms_key_arn     = var.findings_kms_key_arn

  depends_on = [aws_guardduty_detector.main]
}