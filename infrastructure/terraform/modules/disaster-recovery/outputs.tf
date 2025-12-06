output "backup_vault_arn" {
  description = "ARN do Backup Vault"
  value       = aws_backup_vault.main.arn
}

output "backup_vault_name" {
  description = "Nome do Backup Vault"
  value       = aws_backup_vault.main.name
}

output "backup_plan_arn" {
  description = "ARN do Backup Plan"
  value       = aws_backup_plan.main.arn
}

output "backup_plan_id" {
  description = "ID do Backup Plan"
  value       = aws_backup_plan.main.id
}

output "sns_topic_arn" {
  description = "ARN do SNS Topic de DR"
  value       = aws_sns_topic.dr_alerts.arn
}

output "backup_role_arn" {
  description = "ARN da IAM Role de Backup"
  value       = aws_iam_role.backup.arn
}