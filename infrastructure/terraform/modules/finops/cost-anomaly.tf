# ============================================
# AWS COST ANOMALY DETECTION
# ============================================

# COMENTADO por limite excedido para monitores dimensionais
# resource "aws_ce_anomaly_monitor" "service" {
#   name              = "${local.name_prefix}-service-anomaly"
#   monitor_type      = "DIMENSIONAL"
#   monitor_dimension = "SERVICE"
#   tags = local.cost_tags
# }

# Cost Anomaly Monitor - Por Tag (Project) - MANTER APENAS ESTE
resource "aws_ce_anomaly_monitor" "project" {
  name         = "${local.name_prefix}-project-anomaly"
  monitor_type = "CUSTOM"

  monitor_specification = jsonencode({
    And = null
    CostCategories = null
    Dimensions = null
    Not = null
    Or = null
    Tags = {
      Key          = "Project"
      MatchOptions = null
      Values       = [var.project_name]
    }
  })

  tags = local.cost_tags
}

# Anomaly Subscription - Alertas
resource "aws_ce_anomaly_subscription" "main" {
  name = "${local.name_prefix}-anomaly-alerts"

  monitor_arn_list = [
    aws_ce_anomaly_monitor.project.arn
  ]

  # CORRIGIDO: SNS só funciona com IMMEDIATE
  frequency = "IMMEDIATE"

  threshold_expression {
    dimension {
      key           = "ANOMALY_TOTAL_IMPACT_ABSOLUTE"
      match_options = ["GREATER_THAN_OR_EQUAL"]
      values        = [var.anomaly_threshold_amount]
    }
  }

  subscriber {
    type    = "SNS"
    address = aws_sns_topic.cost_alerts.arn
  }

  tags = local.cost_tags
}