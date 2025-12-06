output "domain_endpoint" {
  description = "Endpoint do OpenSearch"
  value       = aws_opensearch_domain.main.endpoint
}

output "domain_arn" {
  description = "ARN do domínio OpenSearch"
  value       = aws_opensearch_domain.main.arn
}

output "domain_id" {
  description = "ID do domínio OpenSearch"
  value       = aws_opensearch_domain.main.domain_id
}

output "kibana_endpoint" {
  description = "Endpoint do OpenSearch Dashboards (Kibana)"
  value       = aws_opensearch_domain.main.dashboard_endpoint
}

output "security_group_id" {
  description = "ID do Security Group do OpenSearch"
  value       = aws_security_group.opensearch.id
}

output "connection_url" {
  description = "URL de conexão HTTPS"
  value       = "https://${aws_opensearch_domain.main.endpoint}"
}