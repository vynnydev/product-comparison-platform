output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.terraform_state.id
}

output "s3_bucket_arn" {
  description = "ARN do bucket S3"
  value       = aws_s3_bucket.terraform_state.arn
}

output "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "dynamodb_table_arn" {
  description = "ARN da tabela DynamoDB"
  value       = aws_dynamodb_table.terraform_locks.arn
}

output "backend_config" {
  description = "Configuração do backend para usar no terraform"
  value = {
    bucket         = aws_s3_bucket.terraform_state.id
    key            = "${var.environment}/terraform.tfstate"
    region         = aws_s3_bucket.terraform_state.region
    dynamodb_table = aws_dynamodb_table.terraform_locks.name
    encrypt        = true
  }
}