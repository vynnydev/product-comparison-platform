# ============================================
# SNS TOPIC - DR Alerts
# ============================================
resource "aws_sns_topic" "dr_alerts" {
  name = "${local.name_prefix}-dr-alerts"

  tags = {
    Name        = "${local.name_prefix}-dr-alerts"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# SNS TOPIC POLICY
# ============================================
resource "aws_sns_topic_policy" "dr_alerts" {
  arn = aws_sns_topic.dr_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAWSServices"
        Effect = "Allow"
        Principal = {
          Service = [
            "backup.amazonaws.com",
            "events.amazonaws.com",
            "cloudwatch.amazonaws.com"
          ]
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.dr_alerts.arn
      }
    ]
  })
}

# ============================================
# SNS SUBSCRIPTION - Email
# ============================================
resource "aws_sns_topic_subscription" "email" {
  count     = length(var.alert_emails)
  topic_arn = aws_sns_topic.dr_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_emails[count.index]
}

# ============================================
# SNS SUBSCRIPTION - Slack (via Lambda ou HTTPS)
# ============================================
resource "aws_sns_topic_subscription" "slack" {
  count     = var.slack_webhook_url != "" ? 1 : 0
  topic_arn = aws_sns_topic.dr_alerts.arn
  protocol  = "https"
  endpoint  = var.slack_webhook_url
}

# ============================================
# CLOUDWATCH ALARMS - DR Monitoring
# ============================================

# RDS - High CPU
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  count               = var.enable_rds_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU utilization is too high"
  alarm_actions       = [aws_sns_topic.dr_alerts.arn]
  ok_actions          = [aws_sns_topic.dr_alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_identifier
  }

  tags = local.tags
}

# RDS - Low Storage
resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  count               = var.enable_rds_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-rds-low-storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 5368709120  # 5GB em bytes
  alarm_description   = "RDS free storage space is too low"
  alarm_actions       = [aws_sns_topic.dr_alerts.arn]
  ok_actions          = [aws_sns_topic.dr_alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_identifier
  }

  tags = local.tags
}

# RDS - Connection Count
resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  count               = var.enable_rds_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-rds-high-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "RDS connection count is too high"
  alarm_actions       = [aws_sns_topic.dr_alerts.arn]
  ok_actions          = [aws_sns_topic.dr_alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_identifier
  }

  tags = local.tags
}

# EKS - Node Not Ready
resource "aws_cloudwatch_metric_alarm" "eks_nodes" {
  count               = var.eks_cluster_name != "" ? 1 : 0
  alarm_name          = "${local.name_prefix}-eks-unhealthy-nodes"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "cluster_node_count"
  namespace           = "ContainerInsights"
  period              = 300
  statistic           = "Average"
  threshold           = var.eks_min_nodes
  alarm_description   = "EKS cluster has fewer healthy nodes than expected"
  treat_missing_data  = "breaching"

  dimensions = {
    ClusterName = var.eks_cluster_name
  }

  alarm_actions = [aws_sns_topic.dr_alerts.arn]

  tags = {
    Name        = "${local.name_prefix}-eks-nodes-alarm"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# ELASTICACHE ALARMS - High Memory
# ============================================
resource "aws_cloudwatch_metric_alarm" "redis_memory" {
  count               = var.enable_elasticache_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-redis-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis memory usage is too high"
  alarm_actions       = [aws_sns_topic.dr_alerts.arn]
  ok_actions          = [aws_sns_topic.dr_alerts.arn]

  dimensions = {
    CacheClusterId = var.elasticache_cluster_id
  }

  tags = local.tags
}