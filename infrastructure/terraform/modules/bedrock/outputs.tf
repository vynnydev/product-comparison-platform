# ============================================
# BEDROCK MODULE OUTPUTS
# ============================================

output "iam_role_arn" {
  description = "ARN of the IAM role for Bedrock access"
  value       = aws_iam_role.bedrock_access.arn
}

output "iam_role_name" {
  description = "Name of the IAM role for Bedrock access"
  value       = aws_iam_role.bedrock_access.name
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy for Bedrock invoke"
  value       = aws_iam_policy.bedrock_invoke.arn
}

output "bedrock_model_id" {
  description = "Bedrock model ID configured"
  value       = var.bedrock_model_id
}

output "bedrock_region" {
  description = "AWS region for Bedrock"
  value       = data.aws_region.current.name
}

# Kubernetes annotation for service account
output "service_account_annotation" {
  description = "Annotation to add to Kubernetes service account for IRSA"
  value       = "eks.amazonaws.com/role-arn: ${aws_iam_role.bedrock_access.arn}"
}

# CloudWatch Log Group
output "log_group_name" {
  description = "CloudWatch Log Group name for Bedrock logs"
  value       = var.enable_logging ? aws_cloudwatch_log_group.bedrock_logs[0].name : null
}

output "log_group_arn" {
  description = "CloudWatch Log Group ARN for Bedrock logs"
  value       = var.enable_logging ? aws_cloudwatch_log_group.bedrock_logs[0].arn : null
}

# SSM Parameter names
output "ssm_model_id_name" {
  description = "SSM Parameter name for model ID"
  value       = aws_ssm_parameter.bedrock_model_id.name
}

output "ssm_role_arn_name" {
  description = "SSM Parameter name for role ARN"
  value       = aws_ssm_parameter.bedrock_role_arn.name
}
