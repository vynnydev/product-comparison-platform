# ============================================
# AWS WAF v2 - Web Application Firewall
# Proteção contra ataques web comuns
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

# ============================================
# WAF WEB ACL
# ============================================
resource "aws_wafv2_web_acl" "main" {
  name        = "${local.name_prefix}-waf"
  description = "WAF for ${var.project_name} - ${var.environment}"
  scope       = var.scope # REGIONAL or CLOUDFRONT

  default_action {
    allow {}
  }

  # ========================================
  # RULE 1: AWS Managed - Common Rule Set
  # Proteção contra ataques comuns
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        # Excluir regras específicas se necessário
        dynamic "rule_action_override" {
          for_each = var.common_ruleset_excluded_rules
          content {
            name = rule_action_override.value
            action_to_use {
              count {}
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 2: AWS Managed - SQL Injection
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesSQLiRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesSQLiRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 3: AWS Managed - Known Bad Inputs
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 4: AWS Managed - Linux OS
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesLinuxRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesLinuxRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesLinuxRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 5: AWS Managed - Amazon IP Reputation
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 5

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 6: AWS Managed - Anonymous IP List
  # Bloqueia VPNs, Proxies, Tor
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesAnonymousIpList"
    priority = 6

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAnonymousIpList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesAnonymousIpList"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 7: Rate Limiting
  # ========================================
  rule {
    name     = "RateLimit"
    priority = 7

    action {
      block {
        custom_response {
          response_code = 429
          custom_response_body_key = "rate-limit-response"
        }
      }
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimit"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # RULE 8: Geo Blocking (opcional)
  # ========================================
  dynamic "rule" {
    for_each = length(var.blocked_countries) > 0 ? [1] : []
    content {
      name     = "GeoBlocking"
      priority = 8

      action {
        block {}
      }

      statement {
        geo_match_statement {
          country_codes = var.blocked_countries
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "GeoBlocking"
        sampled_requests_enabled   = true
      }
    }
  }

  # ========================================
  # RULE 9: IP Whitelist
  # ========================================
  dynamic "rule" {
    for_each = var.whitelisted_ips != null ? [1] : []
    content {
      name     = "IPWhitelist"
      priority = 0

      action {
        allow {}
      }

      statement {
        ip_set_reference_statement {
          arn = aws_wafv2_ip_set.whitelist[0].arn
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "IPWhitelist"
        sampled_requests_enabled   = true
      }
    }
  }

  # ========================================
  # RULE 10: Block Bad Bots
  # ========================================
  rule {
    name     = "AWS-AWSManagedRulesBotControlRuleSet"
    priority = 10

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"

        managed_rule_group_configs {
          aws_managed_rules_bot_control_rule_set {
            inspection_level = "COMMON"
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesBotControlRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # Custom response body
  custom_response_body {
    key          = "rate-limit-response"
    content      = jsonencode({
      error   = "Too Many Requests"
      message = "Rate limit exceeded. Please try again later."
    })
    content_type = "APPLICATION_JSON"
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name_prefix}-waf"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "${local.name_prefix}-waf"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ============================================
# IP SET - Whitelist
# ============================================
resource "aws_wafv2_ip_set" "whitelist" {
  count              = var.whitelisted_ips != null ? 1 : 0
  name               = "${local.name_prefix}-whitelist"
  description        = "Whitelisted IP addresses"
  scope              = var.scope
  ip_address_version = "IPV4"
  addresses          = var.whitelisted_ips

  tags = {
    Name        = "${local.name_prefix}-whitelist"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# IP SET - Blocklist
# ============================================
resource "aws_wafv2_ip_set" "blocklist" {
  name               = "${local.name_prefix}-blocklist"
  description        = "Blocked IP addresses"
  scope              = var.scope
  ip_address_version = "IPV4"
  addresses          = var.blocked_ips

  tags = {
    Name        = "${local.name_prefix}-blocklist"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# WAF ASSOCIATION - ALB
# ============================================
resource "aws_wafv2_web_acl_association" "alb" {
  count        = var.alb_arn != "" ? 1 : 0
  resource_arn = var.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}

# ============================================
# WAF LOGGING
# ============================================
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  count                   = var.enable_logging ? 1 : 0
  log_destination_configs = [aws_cloudwatch_log_group.waf[0].arn]
  resource_arn            = aws_wafv2_web_acl.main.arn

  logging_filter {
    default_behavior = "KEEP"

    filter {
      behavior = "KEEP"

      condition {
        action_condition {
          action = "BLOCK"
        }
      }

      requirement = "MEETS_ANY"
    }
  }
}

# ============================================
# CLOUDWATCH LOG GROUP - WAF Logs
# ============================================
resource "aws_cloudwatch_log_group" "waf" {
  count             = var.enable_logging ? 1 : 0
  name              = "aws-waf-logs-${local.name_prefix}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "aws-waf-logs-${local.name_prefix}"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# CLOUDWATCH ALARMS
# ============================================
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  count               = var.enable_alarms ? 1 : 0
  alarm_name          = "${local.name_prefix}-waf-high-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = var.blocked_requests_threshold
  alarm_description   = "High number of blocked requests by WAF"
  treat_missing_data  = "notBreaching"

  dimensions = {
    WebACL = aws_wafv2_web_acl.main.name
    Region = data.aws_region.current.name
    Rule   = "ALL"
  }

  alarm_actions = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []
  ok_actions    = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []

  tags = {
    Name        = "${local.name_prefix}-waf-alarm"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_cloudwatch_metric_alarm" "waf_rate_limit" {
  count               = var.enable_alarms ? 1 : 0
  alarm_name          = "${local.name_prefix}-waf-rate-limit-triggered"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 60
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "Rate limiting is being triggered frequently"
  treat_missing_data  = "notBreaching"

  dimensions = {
    WebACL = aws_wafv2_web_acl.main.name
    Region = data.aws_region.current.name
    Rule   = "RateLimit"
  }

  alarm_actions = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []

  tags = {
    Name        = "${local.name_prefix}-waf-rate-alarm"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "aws_region" "current" {}