output "security_hub_arn" {
  description = "ARN do Security Hub"
  value       = aws_securityhub_account.main.arn
}

output "event_rule_arn" {
  description = "ARN da EventBridge rule"
  value       = aws_cloudwatch_event_rule.security_hub_findings.arn
}

output "critical_findings_insight_arn" {
  description = "ARN do insight de findings críticos"
  value       = aws_securityhub_insight.critical_findings.arn
}