# ============================================
# API GATEWAY MODULE - OUTPUTS
# ============================================

output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_apigatewayv2_api.main.id
}

output "api_arn" {
  description = "ARN of the API Gateway"
  value       = aws_apigatewayv2_api.main.arn
}

output "api_endpoint" {
  description = "API Gateway endpoint URL (without stage)"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "stage_invoke_url" {
  description = "Stage invoke URL"
  value       = aws_apigatewayv2_stage.main.invoke_url
}

output "stage_arn" {
  description = "ARN of the stage"
  value       = aws_apigatewayv2_stage.main.arn
}

output "execution_arn" {
  description = "Execution ARN of the API"
  value       = aws_apigatewayv2_api.main.execution_arn
}

output "log_group_name" {
  description = "CloudWatch Log Group name"
  value       = aws_cloudwatch_log_group.api_gateway.name
}