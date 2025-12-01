output "broker_id" {
  description = "ID do broker Amazon MQ"
  value       = aws_mq_broker.rabbitmq.id
}

output "broker_arn" {
  description = "ARN do broker Amazon MQ"
  value       = aws_mq_broker.rabbitmq.arn
}

output "broker_endpoint" {
  description = "Endpoint do broker (AMQP)"
  value       = aws_mq_broker.rabbitmq.instances[0].endpoints[0]
}

output "broker_console_url" {
  description = "URL do console de gerenciamento"
  value       = aws_mq_broker.rabbitmq.instances[0].console_url
}

output "security_group_id" {
  description = "Security Group ID do Amazon MQ"
  value       = aws_security_group.amazonmq.id
}

output "ssm_endpoint_parameter" {
  description = "SSM Parameter name para endpoint"
  value       = aws_ssm_parameter.rabbitmq_endpoint.name
}

output "ssm_username_parameter" {
  description = "SSM Parameter name para username"
  value       = aws_ssm_parameter.rabbitmq_username.name
}

output "ssm_password_parameter" {
  description = "SSM Parameter name para password"
  value       = aws_ssm_parameter.rabbitmq_password.name
}