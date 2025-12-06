output "security_dashboard_role_arn" {
  description = "ARN da role do Security Dashboard"
  value       = aws_iam_role.security_dashboard.arn
}

output "guardduty_events_role_arn" {
  description = "ARN da role do GuardDuty Events"
  value       = aws_iam_role.guardduty_events.arn
}

output "waf_exporter_role_arn" {
  description = "ARN da role do WAF Exporter"
  value       = aws_iam_role.waf_exporter.arn
}

output "shield_exporter_role_arn" {
  description = "ARN da role do Shield Exporter"
  value       = aws_iam_role.shield_exporter.arn
}

output "disaster_recovery_role_arn" {
  description = "ARN da role do Disaster Recovery"
  value       = aws_iam_role.disaster_recovery.arn
}

output "cost_exporter_role_arn" {
  description = "ARN da role do Cost Exporter"
  value       = aws_iam_role.cost_exporter.arn
}