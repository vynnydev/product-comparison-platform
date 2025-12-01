output "cluster_id" {
  description = "ID do cluster EKS"
  value       = aws_eks_cluster.main.id
}

output "cluster_endpoint" {
  description = "Endpoint do cluster"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Certificate authority data"
  value       = aws_eks_cluster.main.certificate_authority[0].data
  sensitive   = true
}

output "cluster_name" {
  description = "Nome do cluster"
  value       = aws_eks_cluster.main.name
}

output "oidc_provider_arn" {
  description = "ARN do OIDC provider"
  value       = aws_iam_openid_connect_provider.cluster.arn
}

output "node_security_group_id" {
  description = "Security group dos nodes"
  value       = aws_security_group.node.id
}