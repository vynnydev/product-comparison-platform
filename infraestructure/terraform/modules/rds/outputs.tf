output "db_instance_id" {
  description = "ID da instância RDS"
  value       = aws_db_instance.postgresql.id
}

output "db_instance_arn" {
  description = "ARN da instância RDS"
  value       = aws_db_instance.postgresql.arn
}

output "db_endpoint" {
  description = "Endpoint do RDS"
  value       = aws_db_instance.postgresql.endpoint
}

output "db_address" {
  description = "Endereço do RDS (sem porta)"
  value       = aws_db_instance.postgresql.address
}

output "db_port" {
  description = "Porta do RDS"
  value       = aws_db_instance.postgresql.port
}

output "db_name" {
  description = "Nome do database"
  value       = aws_db_instance.postgresql.db_name
}

output "security_group_id" {
  description = "Security Group ID do RDS"
  value       = aws_security_group.rds.id
}