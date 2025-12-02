output "broker_id" {
  description = "ID of the Amazon MQ broker"
  value       = aws_mq_broker.rabbitmq.id
}

output "broker_arn" {
  description = "ARN of the Amazon MQ broker"
  value       = aws_mq_broker.rabbitmq.arn
}

output "amqp_endpoint" {
  description = "AMQP endpoint for applications"
  value       = aws_mq_broker.rabbitmq.instances[0].endpoints[0]
}

output "console_url" {
  description = "RabbitMQ Management Console URL"
  value       = aws_mq_broker.rabbitmq.instances[0].console_url
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.amazonmq.id
}

output "broker_username" {
  description = "RabbitMQ username"
  value       = var.broker_username
}

output "publicly_accessible" {
  description = "Whether broker is publicly accessible"
  value       = var.publicly_accessible
}