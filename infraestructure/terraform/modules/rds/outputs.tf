# ============================================
# RDS MODULE OUTPUTS
# ============================================

output "db_instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.postgresql.id
}

output "db_instance_arn" {
  description = "RDS instance ARN"
  value       = aws_db_instance.postgresql.arn
}

output "db_endpoint" {
  description = "RDS endpoint (host:port)"
  value       = aws_db_instance.postgresql.endpoint
}

output "db_address" {
  description = "RDS hostname (without port)"
  value       = aws_db_instance.postgresql.address
}

output "db_port" {
  description = "RDS port"
  value       = aws_db_instance.postgresql.port
}

output "db_name" {
  description = "Primary database name"
  value       = aws_db_instance.postgresql.db_name
}

output "db_username" {
  description = "Master username"
  value       = aws_db_instance.postgresql.username
  sensitive   = true
}

output "security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

output "db_subnet_group_name" {
  description = "DB subnet group name"
  value       = aws_db_subnet_group.main.name
}

# SSM Parameter ARNs
output "ssm_endpoint_arn" {
  description = "SSM Parameter ARN for endpoint"
  value       = aws_ssm_parameter.db_endpoint.arn
}

output "ssm_password_arn" {
  description = "SSM Parameter ARN for password"
  value       = aws_ssm_parameter.db_password.arn
}

# All databases (primary + additional)
output "all_databases" {
  description = "List of all database names"
  value       = concat([var.db_name], var.additional_databases)
}
