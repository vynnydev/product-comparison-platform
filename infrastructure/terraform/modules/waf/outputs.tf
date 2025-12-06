output "web_acl_id" {
  description = "ID do Web ACL"
  value       = aws_wafv2_web_acl.main.id
}

output "web_acl_arn" {
  description = "ARN do Web ACL"
  value       = aws_wafv2_web_acl.main.arn
}

output "web_acl_name" {
  description = "Nome do Web ACL"
  value       = aws_wafv2_web_acl.main.name
}

output "web_acl_capacity" {
  description = "Capacidade utilizada do Web ACL"
  value       = aws_wafv2_web_acl.main.capacity
}

output "ip_set_whitelist_arn" {
  description = "ARN do IP Set de whitelist"
  value       = var.whitelisted_ips != null ? aws_wafv2_ip_set.whitelist[0].arn : null
}

output "ip_set_blocklist_arn" {
  description = "ARN do IP Set de blocklist"
  value       = aws_wafv2_ip_set.blocklist.arn
}

output "log_group_name" {
  description = "Nome do CloudWatch Log Group"
  value       = var.enable_logging ? aws_cloudwatch_log_group.waf[0].name : null
}