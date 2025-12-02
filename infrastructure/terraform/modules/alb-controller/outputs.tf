output "iam_role_arn" {
  description = "IAM role ARN for ALB Controller"
  value       = aws_iam_role.alb_controller.arn
}

output "iam_policy_arn" {
  description = "IAM policy ARN for ALB Controller"
  value       = aws_iam_policy.alb_controller.arn
}

output "service_account_name" {
  description = "Kubernetes service account name"
  value       = kubernetes_service_account.alb_controller.metadata[0].name
}

output "helm_release_name" {
  description = "Helm release name"
  value       = helm_release.alb_controller.name
}

output "helm_release_status" {
  description = "Helm release status"
  value       = helm_release.alb_controller.status
}

output "oidc_provider_arn" {
  description = "OIDC provider ARN"
  value       = local.oidc_provider_arn
}