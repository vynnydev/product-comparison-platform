output "sns_topic_arn" {
  description = "ARN do SNS topic de alertas de custo"
  value       = aws_sns_topic.cost_alerts.arn
}

output "monthly_budget_name" {
  description = "Nome do budget mensal"
  value       = aws_budgets_budget.monthly_total.name
}

output "cost_exporter_lambda_arn" {
  description = "ARN da Lambda de exportação de custos"
  value       = aws_lambda_function.cost_exporter.arn
}

output "anomaly_monitor_arns" {
  description = "ARNs dos monitores de anomalia"
  value = [
    aws_ce_anomaly_monitor.project.arn
  ]
}

output "cloudwatch_namespace" {
  description = "Namespace das métricas de custo no CloudWatch"
  value       = "FinOps/Costs"
}