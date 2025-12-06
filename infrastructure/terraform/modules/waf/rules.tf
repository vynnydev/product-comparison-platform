# ============================================
# WAF CUSTOM RULES
# Regras customizadas adicionais
# ============================================

# ============================================
# RULE GROUP: Custom Security Rules
# ============================================
resource "aws_wafv2_rule_group" "custom_security" {
  name        = "${local.name_prefix}-custom-security"
  description = "Custom security rules for ${var.project_name}"
  scope       = var.scope
  capacity    = 500

  # ========================================
  # Rule: Block requests with SQL patterns in URI
  # ========================================
  rule {
    name     = "BlockSQLPatternsInURI"
    priority = 1

    action {
      block {}
    }

    statement {
      regex_pattern_set_reference_statement {
        arn = aws_wafv2_regex_pattern_set.sql_patterns.arn

        field_to_match {
          uri_path {}
        }

        text_transformation {
          priority = 0
          type     = "URL_DECODE"
        }

        text_transformation {
          priority = 1
          type     = "LOWERCASE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockSQLPatternsInURI"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block requests with XSS patterns
  # ========================================
  rule {
    name     = "BlockXSSPatterns"
    priority = 2

    action {
      block {}
    }

    statement {
      regex_pattern_set_reference_statement {
        arn = aws_wafv2_regex_pattern_set.xss_patterns.arn

        field_to_match {
          body {
            oversize_handling = "CONTINUE"
          }
        }

        text_transformation {
          priority = 0
          type     = "URL_DECODE"
        }

        text_transformation {
          priority = 1
          type     = "HTML_ENTITY_DECODE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockXSSPatterns"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block requests from blocked IPs
  # ========================================
  rule {
    name     = "BlockMaliciousIPs"
    priority = 3

    action {
      block {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.blocklist.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockMaliciousIPs"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block requests with suspicious headers
  # ========================================
  rule {
    name     = "BlockSuspiciousHeaders"
    priority = 4

    action {
      block {}
    }

    statement {
      or_statement {
        statement {
          byte_match_statement {
            search_string         = "../"
            positional_constraint = "CONTAINS"

            field_to_match {
              single_header {
                name = "x-forwarded-for"
              }
            }

            text_transformation {
              priority = 0
              type     = "URL_DECODE"
            }
          }
        }

        statement {
          byte_match_statement {
            search_string         = "localhost"
            positional_constraint = "CONTAINS"

            field_to_match {
              single_header {
                name = "host"
              }
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockSuspiciousHeaders"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block requests to sensitive paths
  # ========================================
  rule {
    name     = "BlockSensitivePaths"
    priority = 5

    action {
      block {}
    }

    statement {
      or_statement {
        statement {
          byte_match_statement {
            search_string         = "/.env"
            positional_constraint = "STARTS_WITH"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }

        statement {
          byte_match_statement {
            search_string         = "/.git"
            positional_constraint = "STARTS_WITH"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }

        statement {
          byte_match_statement {
            search_string         = "/wp-admin"
            positional_constraint = "STARTS_WITH"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }

        statement {
          byte_match_statement {
            search_string         = "/phpmyadmin"
            positional_constraint = "CONTAINS"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }

        statement {
          byte_match_statement {
            search_string         = "/actuator"
            positional_constraint = "STARTS_WITH"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockSensitivePaths"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block large request bodies
  # ========================================
  rule {
    name     = "BlockOversizedRequests"
    priority = 6

    action {
      block {}
    }

    statement {
      size_constraint_statement {
        comparison_operator = "GT"
        size                = var.max_body_size

        field_to_match {
          body {
            oversize_handling = "MATCH"
          }
        }

        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockOversizedRequests"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Block requests without User-Agent
  # ========================================
  rule {
    name     = "BlockMissingUserAgent"
    priority = 7

    action {
      block {}
    }

    statement {
      not_statement {
        statement {
          size_constraint_statement {
            comparison_operator = "GT"
            size                = 0

            field_to_match {
              single_header {
                name = "user-agent"
              }
            }

            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockMissingUserAgent"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name_prefix}-custom-security"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "${local.name_prefix}-custom-security"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# REGEX PATTERN SET: SQL Injection Patterns
# ============================================
resource "aws_wafv2_regex_pattern_set" "sql_patterns" {
  name        = "${local.name_prefix}-sql-patterns"
  description = "SQL Injection patterns"
  scope       = var.scope

  regular_expression {
    regex_string = "(?i)(union.*select|select.*from|insert.*into|delete.*from|drop.*table|update.*set)"
  }

  regular_expression {
    regex_string = "(?i)(exec\\s*\\(|execute\\s*\\()"
  }

  regular_expression {
    regex_string = "(?i)(;\\s*--|/\\*.*\\*/)"
  }

  regular_expression {
    regex_string = "(?i)(\\bor\\b.*=.*|\\band\\b.*=.*)"
  }

  regular_expression {
    regex_string = "(?i)(sleep\\s*\\(|benchmark\\s*\\(|waitfor\\s+delay)"
  }

  tags = {
    Name        = "${local.name_prefix}-sql-patterns"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# REGEX PATTERN SET: XSS Patterns
# ============================================
resource "aws_wafv2_regex_pattern_set" "xss_patterns" {
  name        = "${local.name_prefix}-xss-patterns"
  description = "Cross-Site Scripting patterns"
  scope       = var.scope

  regular_expression {
    regex_string = "(?i)(<script[^>]*>|</script>)"
  }

  regular_expression {
    regex_string = "(?i)(javascript:|vbscript:|data:text/html)"
  }

  regular_expression {
    regex_string = "(?i)(on\\w+\\s*=)"
  }

  regular_expression {
    regex_string = "(?i)(<iframe|<object|<embed|<applet)"
  }

  regular_expression {
    regex_string = "(?i)(expression\\s*\\(|eval\\s*\\()"
  }

  tags = {
    Name        = "${local.name_prefix}-xss-patterns"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# REGEX PATTERN SET: Path Traversal Patterns
# ============================================
resource "aws_wafv2_regex_pattern_set" "path_traversal" {
  name        = "${local.name_prefix}-path-traversal"
  description = "Path Traversal patterns"
  scope       = var.scope

  regular_expression {
    regex_string = "(\\.\\./|\\.\\.\\\\)"
  }

  regular_expression {
    regex_string = "(%2e%2e%2f|%2e%2e/|\\.\\.%2f)"
  }

  regular_expression {
    regex_string = "(%252e%252e%252f)"
  }

  regular_expression {
    regex_string = "(/etc/passwd|/etc/shadow|c:\\\\windows)"
  }

  tags = {
    Name        = "${local.name_prefix}-path-traversal"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# RULE GROUP: API Protection
# ============================================
resource "aws_wafv2_rule_group" "api_protection" {
  name        = "${local.name_prefix}-api-protection"
  description = "API-specific protection rules"
  scope       = var.scope
  capacity    = 200

  # ========================================
  # Rule: Validate Content-Type for POST/PUT
  # ========================================
  rule {
    name     = "ValidateContentType"
    priority = 1

    action {
      block {}
    }

    statement {
      and_statement {
        statement {
          or_statement {
            statement {
              byte_match_statement {
                search_string         = "POST"
                positional_constraint = "EXACTLY"

                field_to_match {
                  method {}
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }

            statement {
              byte_match_statement {
                search_string         = "PUT"
                positional_constraint = "EXACTLY"

                field_to_match {
                  method {}
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
          }
        }

        statement {
          not_statement {
            statement {
              or_statement {
                statement {
                  byte_match_statement {
                    search_string         = "application/json"
                    positional_constraint = "CONTAINS"

                    field_to_match {
                      single_header {
                        name = "content-type"
                      }
                    }

                    text_transformation {
                      priority = 0
                      type     = "LOWERCASE"
                    }
                  }
                }

                statement {
                  byte_match_statement {
                    search_string         = "application/x-www-form-urlencoded"
                    positional_constraint = "CONTAINS"

                    field_to_match {
                      single_header {
                        name = "content-type"
                      }
                    }

                    text_transformation {
                      priority = 0
                      type     = "LOWERCASE"
                    }
                  }
                }

                statement {
                  byte_match_statement {
                    search_string         = "multipart/form-data"
                    positional_constraint = "CONTAINS"

                    field_to_match {
                      single_header {
                        name = "content-type"
                      }
                    }

                    text_transformation {
                      priority = 0
                      type     = "LOWERCASE"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "ValidateContentType"
      sampled_requests_enabled   = true
    }
  }

  # ========================================
  # Rule: Rate limit per API endpoint
  # ========================================
  rule {
    name     = "APIEndpointRateLimit"
    priority = 2

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.api_rate_limit
        aggregate_key_type = "IP"

        scope_down_statement {
          byte_match_statement {
            search_string         = "/api/"
            positional_constraint = "STARTS_WITH"

            field_to_match {
              uri_path {}
            }

            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "APIEndpointRateLimit"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name_prefix}-api-protection"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "${local.name_prefix}-api-protection"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# Associate Custom Rule Groups with Web ACL
# ============================================
resource "aws_wafv2_web_acl_association" "custom_security" {
  count        = var.enable_custom_rules && var.alb_arn != "" ? 1 : 0
  resource_arn = var.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn

  depends_on = [
    aws_wafv2_rule_group.custom_security,
    aws_wafv2_rule_group.api_protection
  ]
}