output "zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "zone_name" {
  description = "Route 53 Hosted Zone Name"
  value       = aws_route53_zone.main.name
}

output "name_servers" {
  description = "Name servers for the hosted zone (configure these in Hostinger)"
  value       = aws_route53_zone.main.name_servers
}

output "name_servers_string" {
  description = "Name servers as a single string"
  value       = join(", ", aws_route53_zone.main.name_servers)
}