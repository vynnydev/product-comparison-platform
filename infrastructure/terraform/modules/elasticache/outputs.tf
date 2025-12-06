output "redis_endpoint" {
  description = "Endpoint do Redis (primary)"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_reader_endpoint" {
  description = "Endpoint de leitura do Redis"
  value       = aws_elasticache_replication_group.redis.reader_endpoint_address
}

output "redis_port" {
  description = "Porta do Redis"
  value       = 6379
}

output "redis_connection_string" {
  description = "String de conexão para aplicações"
  value       = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:6379"
}

output "security_group_id" {
  description = "ID do Security Group do Redis"
  value       = aws_security_group.redis.id
}

output "replication_group_id" {
  description = "ID do Replication Group do Redis"
  value       = aws_elasticache_replication_group.redis.id
}