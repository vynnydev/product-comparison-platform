# ============================================
# 🌐 NETWORK OUTPUTS
# ============================================

output "vpc_id" {
  description = "ID da VPC criada"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block da VPC"
  value       = var.vpc_cidr
}

output "private_subnet_ids" {
  description = "IDs das subnets privadas"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas"
  value       = module.vpc.public_subnet_ids
}

output "availability_zones" {
  description = "Availability Zones utilizadas"
  value       = var.availability_zones
}

# ============================================
# 🐳 ECR OUTPUTS
# ============================================

output "ecr_product_service_url" {
  description = "ECR URL for Product Service"
  value       = module.ecr.product_service_url
}

output "ecr_ai_service_url" {
  description = "ECR URL for AI Service"
  value       = module.ecr.ai_service_url
}

output "ecr_frontend_url" {
  description = "ECR URL for Frontend"
  value       = module.ecr.frontend_url
}

output "ecr_repository_urls" {
  description = "All ECR repository URLs"
  value       = module.ecr.repository_urls
}

# ============================================
# ☸️ EKS CLUSTER OUTPUTS
# ============================================

output "eks_cluster_id" {
  description = "ID único do cluster EKS"
  value       = module.eks.cluster_id
}

output "eks_cluster_name" {
  description = "Nome do cluster EKS"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint da API do Kubernetes"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  description = "Versão do Kubernetes"
  value       = var.kubernetes_version
}

output "eks_cluster_security_group_id" {
  description = "Security Group do cluster EKS"
  value       = module.eks.node_security_group_id
}

output "eks_cluster_certificate_authority_data" {
  description = "Certificate Authority data (base64)"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "eks_oidc_provider_arn" {
  description = "ARN do OIDC provider"
  value       = module.eks.oidc_provider_arn
}

output "eks_oidc_provider_url" {
  description = "URL do OIDC provider"
  value       = replace(module.eks.oidc_provider_arn, "/^(.*provider/)/", "")
}

# ============================================
# 🔐 IAM OUTPUTS
# ============================================

output "eks_cluster_role_arn" {
  description = "ARN do IAM role do control plane"
  value       = module.iam.eks_cluster_role_arn
}

output "eks_node_role_arn" {
  description = "ARN do IAM role dos worker nodes"
  value       = module.iam.eks_node_role_arn
}

output "load_balancer_controller_policy_arn" {
  description = "ARN da policy para AWS Load Balancer Controller"
  value       = module.iam.load_balancer_controller_policy_arn
}

# ============================================
# 💻 NODE GROUP OUTPUTS
# ============================================

output "node_group_configuration" {
  description = "Configuração do Node Group"
  value = {
    instance_types = var.node_instance_types
    desired_size   = var.node_desired_size
    min_size       = var.node_min_size
    max_size       = var.node_max_size
  }
}

# ============================================
# 🗄️ RDS OUTPUTS
# ============================================

output "rds_endpoint" {
  description = "Endpoint do RDS"
  value       = module.rds.db_endpoint
}

output "rds_instance_id" {
  description = "ID da instância RDS"
  value       = module.rds.db_instance_id
}

output "rds_arn" {
  description = "ARN da instância RDS"
  value       = module.rds.db_instance_arn
}

output "rds_database_name" {
  description = "Nome do banco de dados"
  value       = var.db_name
}

# ============================================
# 🐰 AMAZON MQ OUTPUTS
# ============================================

output "rabbitmq_endpoint" {
  description = "Endpoint do RabbitMQ"
  value       = module.amazonmq.amqp_endpoint
}

output "rabbitmq_console_url" {
  description = "URL do console do RabbitMQ"
  value       = module.amazonmq.console_url
}

output "rabbitmq_broker_id" {
  description = "ID do broker RabbitMQ"
  value       = module.amazonmq.broker_id
}

# ============================================
# 🔴 ELASTICACHE OUTPUTS
# ============================================

output "redis_endpoint" {
  description = "Endpoint do Redis"
  value       = module.elasticache.redis_endpoint
}

output "redis_connection_string" {
  description = "String de conexão do Redis"
  value       = module.elasticache.redis_connection_string
}

output "redis_cluster_id" {
  description = "ID do cluster Redis"
  value       = module.elasticache.replication_group_id
}

# ============================================
# 🔍 OPENSEARCH OUTPUTS
# ============================================

output "opensearch_endpoint" {
  description = "Endpoint do OpenSearch"
  value       = module.opensearch.domain_endpoint
}

output "opensearch_dashboard_url" {
  description = "URL do OpenSearch Dashboards"
  value       = module.opensearch.kibana_endpoint
}

output "opensearch_domain_arn" {
  description = "ARN do domain OpenSearch"
  value       = module.opensearch.domain_arn
}

# ============================================
# 🌐 ROUTE53 OUTPUTS
# ============================================

output "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = module.route53.zone_id
}

output "route53_name_servers" {
  description = "Name servers - Configure no registrador!"
  value       = module.route53.name_servers
}

# ============================================
# 🔒 ACM OUTPUTS
# ============================================

output "acm_certificate_arn" {
  description = "ARN do certificado SSL"
  value       = module.acm.certificate_arn
}

output "acm_certificate_domain" {
  description = "Domínio do certificado"
  value       = var.domain_name
}

# ============================================
# ☁️ CLOUDFRONT OUTPUTS
# ============================================

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name do CloudFront"
  value       = module.cloudfront.distribution_domain_name
}

output "frontend_url" {
  description = "URL do frontend"
  value       = module.cloudfront.website_url
}

output "frontend_s3_bucket" {
  description = "Bucket S3 para deploy do frontend"
  value       = module.cloudfront.s3_bucket_name
}


# ============================================
# 🤖 API GATEWAY & LAMBDA OUTPUTS
# ============================================

output "ai_api_url" {
  description = "AI Service API URL"
  value       = "${module.api_gateway_ai.stage_invoke_url}/ai"
}

output "ai_health_url" {
  description = "AI Service Health Check URL"
  value       = "${module.api_gateway_ai.stage_invoke_url}/ai/health"
}

output "lambda_ai_function_name" {
  description = "Lambda function name"
  value       = module.lambda_ai.function_name
}

output "lambda_ai_function_arn" {
  description = "Lambda function ARN"
  value       = module.lambda_ai.function_arn
}

# ============================================
# 🛡️ WAF OUTPUTS
# ============================================

output "waf_web_acl_id" {
  description = "ID do Web ACL do WAF"
  value       = var.enable_waf ? module.waf[0].web_acl_id : null
}

output "waf_web_acl_arn" {
  description = "ARN do Web ACL do WAF"
  value       = var.enable_waf ? module.waf[0].web_acl_arn : null
}

output "waf_web_acl_name" {
  description = "Nome do Web ACL do WAF"
  value       = var.enable_waf ? module.waf[0].web_acl_name : null
}

output "waf_log_group_name" {
  description = "CloudWatch Log Group do WAF"
  value       = var.enable_waf ? module.waf[0].log_group_name : null
}

output "waf_ip_set_blocklist_arn" {
  description = "ARN do IP Set de blocklist"
  value       = var.enable_waf ? module.waf[0].ip_set_blocklist_arn : null
}

# ============================================
# 🔍 GUARDDUTY OUTPUTS
# ============================================

output "guardduty_detector_id" {
  description = "ID do detector GuardDuty"
  value       = var.enable_guardduty ? module.guardduty[0].detector_id : null
}

output "guardduty_detector_arn" {
  description = "ARN do detector GuardDuty"
  value       = var.enable_guardduty ? module.guardduty[0].detector_arn : null
}

output "guardduty_event_rule_arn" {
  description = "ARN da EventBridge rule do GuardDuty"
  value       = var.enable_guardduty ? module.guardduty[0].event_rule_arn : null
}

# ============================================
# 🛡️ SECURITY HUB OUTPUTS
# ============================================

output "security_hub_arn" {
  description = "ARN do Security Hub"
  value       = var.enable_security_hub ? module.security_hub[0].security_hub_arn : null
}

output "security_hub_event_rule_arn" {
  description = "ARN da EventBridge rule do Security Hub"
  value       = var.enable_security_hub ? module.security_hub[0].event_rule_arn : null
}

# ============================================
# 🆘 DISASTER RECOVERY OUTPUTS
# ============================================

output "dr_backup_vault_arn" {
  description = "ARN do Backup Vault"
  value       = var.enable_disaster_recovery ? module.disaster_recovery[0].backup_vault_arn : null
}

output "dr_backup_vault_name" {
  description = "Nome do Backup Vault"
  value       = var.enable_disaster_recovery ? module.disaster_recovery[0].backup_vault_name : null
}

output "dr_backup_plan_arn" {
  description = "ARN do Backup Plan"
  value       = var.enable_disaster_recovery ? module.disaster_recovery[0].backup_plan_arn : null
}

output "dr_sns_topic_arn" {
  description = "ARN do SNS Topic de DR"
  value       = var.enable_disaster_recovery ? module.disaster_recovery[0].sns_topic_arn : null
}

# ============================================
# 🔐 SECURITY IAM OUTPUTS
# ============================================

output "security_dashboard_role_arn" {
  description = "ARN da role do Security Dashboard"
  value       = module.security_iam.security_dashboard_role_arn
}

output "guardduty_events_role_arn" {
  description = "ARN da role do GuardDuty Events"
  value       = module.security_iam.guardduty_events_role_arn
}

output "waf_exporter_role_arn" {
  description = "ARN da role do WAF Exporter"
  value       = module.security_iam.waf_exporter_role_arn
}

output "disaster_recovery_role_arn" {
  description = "ARN da role do Disaster Recovery"
  value       = module.security_iam.disaster_recovery_role_arn
}

# ============================================
# 🚀 QUICK START COMMANDS
# ============================================

output "step_1_configure_kubectl" {
  description = "PASSO 1: Configure o kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "step_2_verify_nodes" {
  description = "PASSO 2: Verifique os nodes"
  value       = "kubectl get nodes -o wide"
}

output "step_3_ecr_login" {
  description = "PASSO 3: Login no ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

output "step_4_deploy_apps" {
  description = "PASSO 4: Deploy das aplicações"
  value       = "kubectl apply -k k8s/overlays/dev/"
}

output "step_5_check_pods" {
  description = "PASSO 5: Verificar pods"
  value       = "kubectl get pods -n product-platform"
}

# ============================================
# 📊 INFRASTRUCTURE SUMMARY
# ============================================

output "infrastructure_summary" {
  description = "Resumo completo da infraestrutura"
  value = {
    # General
    region      = var.aws_region
    environment = var.environment
    project     = var.project_name

    # Network
    vpc_id             = module.vpc.vpc_id
    vpc_cidr           = var.vpc_cidr
    availability_zones = var.availability_zones

    # Compute
    eks_cluster_name = module.eks.cluster_name
    eks_version      = var.kubernetes_version
    node_count       = "${var.node_min_size}-${var.node_max_size} nodes"
    instance_type    = join(", ", var.node_instance_types)

    # Data
    rds_endpoint        = module.rds.db_endpoint
    redis_endpoint      = module.elasticache.redis_endpoint
    opensearch_endpoint = module.opensearch.domain_endpoint
    rabbitmq_endpoint   = module.amazonmq.amqp_endpoint

    # Security
    waf_enabled          = var.enable_waf
    guardduty_enabled    = var.enable_guardduty
    security_hub_enabled = var.enable_security_hub

    # DR
    dr_enabled   = var.enable_disaster_recovery
    backup_vault = var.enable_disaster_recovery ? module.disaster_recovery[0].backup_vault_name : "N/A"

    # URLs - SEM [0] pois não usam count
    frontend_url = module.cloudfront.website_url
    api_url      = module.api_gateway_ai.stage_invoke_url
  }
}

# ============================================
# 🔗 AWS CONSOLE LINKS
# ============================================

output "aws_console_links" {
  description = "Links diretos para AWS Console"
  value = {
    eks_cluster   = "https://${var.aws_region}.console.aws.amazon.com/eks/home?region=${var.aws_region}#/clusters/${module.eks.cluster_name}"
    ecr_repos     = "https://${var.aws_region}.console.aws.amazon.com/ecr/repositories?region=${var.aws_region}"
    vpc           = "https://${var.aws_region}.console.aws.amazon.com/vpc/home?region=${var.aws_region}#VpcDetails:VpcId=${module.vpc.vpc_id}"
    rds           = "https://${var.aws_region}.console.aws.amazon.com/rds/home?region=${var.aws_region}#database:id=${module.rds.db_instance_id}"
    waf           = "https://${var.aws_region}.console.aws.amazon.com/wafv2/homev2/web-acls?region=${var.aws_region}"
    guardduty     = "https://${var.aws_region}.console.aws.amazon.com/guardduty/home?region=${var.aws_region}"
    security_hub  = "https://${var.aws_region}.console.aws.amazon.com/securityhub/home?region=${var.aws_region}"
    backup        = "https://${var.aws_region}.console.aws.amazon.com/backup/home?region=${var.aws_region}"
    cloudwatch    = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}"
  }
}

# ============================================
# 🔐 SECURITY SUMMARY
# ============================================

output "security_summary" {
  description = "Resumo de segurança"
  value = {
    waf = {
      enabled          = var.enable_waf
      web_acl_name     = var.enable_waf ? module.waf[0].web_acl_name : "N/A"
      rate_limit       = var.waf_rate_limit
      logging_enabled  = var.waf_enable_logging
    }
    guardduty = {
      enabled           = var.enable_guardduty
      s3_protection     = var.guardduty_enable_s3_protection
      eks_protection    = var.guardduty_enable_eks_protection
      malware_protection = var.guardduty_enable_malware_protection
    }
    security_hub = {
      enabled            = var.enable_security_hub
      aws_foundational   = var.security_hub_enable_aws_foundational
      cis_benchmark      = var.security_hub_enable_cis_benchmark
    }
    disaster_recovery = {
      enabled              = var.enable_disaster_recovery
      backup_retention     = var.dr_backup_delete_after
      cold_storage_after   = var.dr_backup_cold_storage_after
    }
  }
}

# ============================================
# 💰 ESTIMATED COSTS
# ============================================

output "estimated_monthly_costs" {
  description = "Custos estimados mensais (USD)"
  value = {
    eks_control_plane = "$73.00"
    ec2_nodes         = "$${var.node_desired_size * 30.37} (t3.medium)"
    nat_gateway       = "$32.85"
    rds               = "$12.41 (db.t3.micro)"
    elasticache       = "$12.41 (cache.t3.micro)"
    opensearch        = "$25.00 (t3.small.search)"
    amazonmq          = "$27.00 (mq.t3.micro)"
    waf               = "$5.00 + $1/M requests"
    guardduty         = "~$5-10 (based on events)"
    security_hub      = "~$0.001/check"
    backup            = "~$0.05/GB stored"
    load_balancer     = "$16.20"
    cloudfront        = "Variable based on traffic"
    total_estimated   = "~$220-300/month (dev)"
  }
}

# ============================================
# 🛠️ TROUBLESHOOTING COMMANDS
# ============================================

output "troubleshooting_commands" {
  description = "Comandos úteis para troubleshooting"
  value = {
    view_cluster_info     = "kubectl cluster-info"
    view_all_resources    = "kubectl get all -A"
    view_events           = "kubectl get events -A --sort-by='.lastTimestamp'"
    view_pod_logs         = "kubectl logs -f <pod-name> -n product-platform"
    describe_pod          = "kubectl describe pod <pod-name> -n product-platform"
    check_security_status = "aws securityhub get-findings --filters '{\"SeverityLabel\":[{\"Value\":\"CRITICAL\",\"Comparison\":\"EQUALS\"}]}'"
    check_guardduty       = "aws guardduty list-findings --detector-id ${var.enable_guardduty ? module.guardduty[0].detector_id : "N/A"}"
    check_waf_logs        = "aws logs filter-log-events --log-group-name aws-waf-logs-${var.project_name}-${var.environment}"
    check_backups         = "aws backup list-backup-jobs --by-state COMPLETED"
  }
}

# ============================================
# 📝 NEXT STEPS
# ============================================

output "next_steps" {
  description = "Próximos passos após deploy"
  value = <<-EOT
    ╔══════════════════════════════════════════════════════════════════╗
    ║  ✅ INFRAESTRUTURA CRIADA COM SUCESSO!                           ║
    ╠══════════════════════════════════════════════════════════════════╣
    ║                                                                  ║
    ║  📋 PRÓXIMOS PASSOS:                                             ║
    ║                                                                  ║
    ║  1️⃣  Configure kubectl:                                          ║
    ║     aws eks update-kubeconfig --region ${var.aws_region} \       ║
    ║       --name ${module.eks.cluster_name}                          ║
    ║                                                                  ║
    ║  2️⃣  Deploy Kubernetes manifests:                                ║
    ║     kubectl apply -k k8s/overlays/dev/                           ║
    ║                                                                  ║
    ║  3️⃣  Verifique a segurança:                                      ║
    ║     - WAF: https://console.aws.amazon.com/wafv2                  ║
    ║     - GuardDuty: https://console.aws.amazon.com/guardduty        ║
    ║     - Security Hub: https://console.aws.amazon.com/securityhub   ║
    ║                                                                  ║
    ║  4️⃣  Configure monitoramento:                                    ║
    ║     kubectl port-forward svc/grafana 3000:3000 -n monitoring     ║
    ║                                                                  ║
    ║  5️⃣  Configure alertas (se não configurado):                     ║
    ║     - Slack/Discord webhooks                                     ║
    ║     - PagerDuty integration                                      ║
    ║                                                                  ║
    ║  🔐 RECURSOS DE SEGURANÇA HABILITADOS:                           ║
    ║     ✅ AWS WAF - Web Application Firewall                        ║
    ║     ✅ AWS GuardDuty - Threat Detection                          ║
    ║     ✅ AWS Security Hub - Compliance & Findings                  ║
    ║     ✅ AWS Backup - Disaster Recovery                            ║
    ║     ✅ AWS Shield Standard - DDoS Protection                     ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
  EOT
}

# ============================================
# 🔍 METADATA
# ============================================

data "aws_caller_identity" "current" {}

output "aws_account_id" {
  description = "ID da conta AWS"
  value       = data.aws_caller_identity.current.account_id
}

output "deployment_region" {
  description = "Região do deploy"
  value       = var.aws_region
}

output "deployment_timestamp" {
  description = "Timestamp do deploy"
  value       = timestamp()
}

# ============================================
# 💰 FINOPS OUTPUTS
# ============================================

output "finops_sns_topic_arn" {
  description = "ARN do SNS topic de alertas de custo"
  value       = var.enable_finops ? module.finops[0].sns_topic_arn : null
}

output "finops_budget_name" {
  description = "Nome do budget mensal"
  value       = var.enable_finops ? module.finops[0].monthly_budget_name : null
}

output "finops_cost_exporter_lambda" {
  description = "ARN da Lambda de exportação de custos"
  value       = var.enable_finops ? module.finops[0].cost_exporter_lambda_arn : null
}

output "finops_cloudwatch_namespace" {
  description = "Namespace das métricas de custo"
  value       = var.enable_finops ? module.finops[0].cloudwatch_namespace : null
}

output "finops_summary" {
  description = "Resumo FinOps"
  value = var.enable_finops ? {
    monthly_budget = "$${var.finops_monthly_budget_limit}"
    eks_budget     = "$${var.finops_eks_budget_limit}"
    rds_budget     = "$${var.finops_rds_budget_limit}"
    ec2_budget     = "$${var.finops_ec2_budget_limit}"
    anomaly_threshold = "$${var.finops_anomaly_threshold}"
  } : null
}