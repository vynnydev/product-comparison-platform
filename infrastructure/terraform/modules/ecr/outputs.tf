output "repository_urls" {
  description = "URLs dos repositórios ECR"
  value       = { for k, v in aws_ecr_repository.services : k => v.repository_url }
}

output "repository_arns" {
  description = "ARNs dos repositórios ECR"
  value       = { for k, v in aws_ecr_repository.services : k => v.arn }
}

output "product_service_url" {
  description = "URL do repositório product-service"
  value       = aws_ecr_repository.services["product-service"].repository_url
}

output "ai_service_url" {
  description = "URL do repositório ai-service"
  value       = aws_ecr_repository.services["ai-service"].repository_url
}

# Mantendo compatibilidade com outputs antigos
output "repository_url" {
  description = "URL do repositório principal (product-service)"
  value       = aws_ecr_repository.services["product-service"].repository_url
}

output "repository_arn" {
  description = "ARN do repositório principal (product-service)"
  value       = aws_ecr_repository.services["product-service"].arn
}