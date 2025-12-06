output "detector_id" {
  description = "ID do detector GuardDuty"
  value       = aws_guardduty_detector.main.id
}

output "detector_arn" {
  description = "ARN do detector GuardDuty"
  value       = aws_guardduty_detector.main.arn
}

output "event_rule_arn" {
  description = "ARN da EventBridge rule"
  value       = aws_cloudwatch_event_rule.guardduty_findings.arn
}

output "event_rule_name" {
  description = "Nome da EventBridge rule"
  value       = aws_cloudwatch_event_rule.guardduty_findings.name
}