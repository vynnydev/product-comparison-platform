output "eks_cluster_role_arn" {
  description = "ARN do IAM role do EKS cluster"
  value       = aws_iam_role.eks_cluster.arn
}

output "eks_node_role_arn" {
  description = "ARN do IAM role dos nodes"
  value       = aws_iam_role.eks_node.arn
}

output "eks_node_role_name" {
  description = "Nome do IAM role dos nodes"
  value       = aws_iam_role.eks_node.name
}

output "load_balancer_controller_policy_arn" {
  description = "ARN da policy do Load Balancer Controller"
  value       = aws_iam_policy.aws_load_balancer_controller.arn
}