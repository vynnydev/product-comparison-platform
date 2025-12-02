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
  description = "IDs das subnets privadas (onde os pods rodam)"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas (onde o Load Balancer fica)"
  value       = module.vpc.public_subnet_ids
}

output "availability_zones" {
  description = "Availability Zones utilizadas"
  value       = var.availability_zones
}

# ============================================
# 🐳 ECR OUTPUTS
# ============================================

output "ecr_repository_urls" {
  description = "URLs dos repositórios ECR"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "ARNs dos repositórios ECR"
  value       = module.ecr.repository_arns
}

output "ecr_product_service_url" {
  description = "URL do repositório ECR do product-service"
  value       = module.ecr.product_service_url
}

output "ecr_ai_service_url" {
  description = "URL do repositório ECR do ai-service"
  value       = module.ecr.ai_service_url
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
  description = "Versão do Kubernetes rodando no cluster"
  value       = var.kubernetes_version
}

output "eks_cluster_security_group_id" {
  description = "Security Group do cluster EKS"
  value       = module.eks.node_security_group_id
}

output "eks_cluster_certificate_authority_data" {
  description = "Certificate Authority data (base64 encoded)"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "eks_oidc_provider_arn" {
  description = "ARN do OIDC provider (para Service Accounts com IAM)"
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
# 🚀 QUICK START COMMANDS
# ============================================

output "step_1_configure_kubectl" {
  description = "PASSO 1: Configure o kubectl para acessar o cluster"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "step_2_verify_nodes" {
  description = "PASSO 2: Verifique se os nodes estão rodando"
  value       = "kubectl get nodes -o wide"
}

output "step_3_ecr_login" {
  description = "PASSO 3: Faça login no ECR para push de imagens"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

output "step_4_build_and_push" {
  description = "PASSO 4: Build e push das imagens Docker"
  value       = <<-EOT
    # Product Service
    cd backend/product-service
    docker build -t ${module.ecr.product_service_url}:latest .
    docker push ${module.ecr.product_service_url}:latest

    # AI Service
    cd ../ai-service
    docker build -t ${module.ecr.ai_service_url}:latest .
    docker push ${module.ecr.ai_service_url}:latest
  EOT
}

output "step_5_deploy_app" {
  description = "PASSO 5: Deploy da aplicação no Kubernetes"
  value       = "kubectl apply -k k8s/"
}

output "step_6_check_pods" {
  description = "PASSO 6: Verificar status dos pods"
  value       = "kubectl get pods -n product-platform"
}

output "step_7_get_service_url" {
  description = "PASSO 7: Obter URL do Load Balancer"
  value       = "kubectl get svc -n product-platform"
}

# ============================================
# 📊 INFRASTRUCTURE SUMMARY
# ============================================

output "infrastructure_summary" {
  description = "Resumo completo da infraestrutura criada"
  value = {
    region               = var.aws_region
    environment          = var.environment
    project              = var.project_name
    vpc_cidr             = var.vpc_cidr
    availability_zones   = var.availability_zones
    eks_version          = var.kubernetes_version
    node_count           = "${var.node_min_size}-${var.node_max_size} nodes"
    instance_type        = join(", ", var.node_instance_types)
    ecr_product_service  = module.ecr.product_service_url
    ecr_ai_service       = module.ecr.ai_service_url
    cluster_endpoint     = module.eks.cluster_endpoint
  }
}

# ============================================
# 💰 ESTIMATED COSTS
# ============================================

output "estimated_monthly_costs" {
  description = "Custos estimados mensais (USD)"
  value = {
    eks_control_plane = "$73.00 (cluster)"
    ec2_nodes         = "$${var.node_desired_size * 30.37} (t3.medium ${var.node_desired_size}x nodes 24/7)"
    nat_gateway       = "$32.85 (1x NAT Gateway)"
    load_balancer     = "$16.20 (ALB/NLB estimated)"
    ecr_storage       = "$0.10 per GB/month"
    data_transfer     = "Variable based on traffic"
    total_estimated   = "$${73 + (var.node_desired_size * 30.37) + 32.85 + 16.20} + storage/traffic"
  }
}

# ============================================
# 🔗 USEFUL LINKS
# ============================================

output "aws_console_links" {
  description = "Links diretos para AWS Console"
  value = {
    eks_cluster = "https://${var.aws_region}.console.aws.amazon.com/eks/home?region=${var.aws_region}#/clusters/${module.eks.cluster_name}"
    ecr_repos   = "https://${var.aws_region}.console.aws.amazon.com/ecr/repositories?region=${var.aws_region}"
    vpc         = "https://${var.aws_region}.console.aws.amazon.com/vpc/home?region=${var.aws_region}#VpcDetails:VpcId=${module.vpc.vpc_id}"
    ec2_nodes   = "https://${var.aws_region}.console.aws.amazon.com/ec2/home?region=${var.aws_region}#Instances:tag:eks:cluster-name=${module.eks.cluster_name};sort=instanceState"
  }
}

# ============================================
# 🛠️ TROUBLESHOOTING COMMANDS
# ============================================

output "troubleshooting_commands" {
  description = "Comandos úteis para troubleshooting"
  value = {
    view_cluster_info        = "kubectl cluster-info"
    view_all_resources       = "kubectl get all -A"
    view_events              = "kubectl get events -A --sort-by='.lastTimestamp'"
    view_pod_logs            = "kubectl logs -f <pod-name> -n product-platform"
    describe_pod             = "kubectl describe pod <pod-name> -n product-platform"
    exec_into_pod            = "kubectl exec -it <pod-name> -n product-platform -- /bin/sh"
    view_node_info           = "kubectl describe nodes"
    check_cluster_health     = "kubectl get --raw '/healthz?verbose'"
    view_api_server_logs     = "kubectl logs -n kube-system -l component=kube-apiserver"
    delete_stuck_resources   = "kubectl delete pod <pod-name> -n product-platform --grace-period=0 --force"
  }
}

# ============================================
# 📝 NEXT STEPS
# ============================================

output "next_steps" {
  description = "Próximos passos após deploy"
  value = <<-EOT
    ╔═══════════════════════════════════════════════════════════════╗
    ║  ✅ INFRAESTRUTURA CRIADA COM SUCESSO!                        ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  📋 PRÓXIMOS PASSOS:                                          ║
    ║                                                               ║
    ║  1️⃣  Configure kubectl:                                       ║
    ║     aws eks update-kubeconfig --region ${var.aws_region} \    ║
    ║       --name ${module.eks.cluster_name}                       ║
    ║                                                               ║
    ║  2️⃣  Verifique nodes:                                         ║
    ║     kubectl get nodes                                         ║
    ║                                                               ║
    ║  3️⃣  Faça login no ECR:                                       ║
    ║     aws ecr get-login-password --region ${var.aws_region} \   ║
    ║       | docker login --username AWS --password-stdin \        ║
    ║       ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com
    ║                                                               ║
    ║  4️⃣  Build e Push das imagens:                                ║
    ║     # Product Service                                         ║
    ║     docker build -t ${module.ecr.product_service_url}:latest .║
    ║     docker push ${module.ecr.product_service_url}:latest      ║
    ║                                                               ║
    ║     # AI Service                                              ║
    ║     docker build -t ${module.ecr.ai_service_url}:latest .     ║
    ║     docker push ${module.ecr.ai_service_url}:latest           ║
    ║                                                               ║
    ║  5️⃣  Deploy no Kubernetes:                                    ║
    ║     kubectl apply -k k8s/                                     ║
    ║                                                               ║
    ║  6️⃣  Verificar pods:                                          ║
    ║     kubectl get pods -n product-platform                      ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
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
  description = "Região onde foi feito o deploy"
  value       = var.aws_region
}

output "deployment_timestamp" {
  description = "Timestamp do deploy"
  value       = timestamp()
}

# ============================================
# API Gateway
# ============================================
output "ai_api_url" {
  description = "AI Service API URL"
  value       = "${module.api_gateway_ai.stage_invoke_url}/ai"
}

output "ai_health_url" {
  description = "AI Service Health Check URL"
  value       = "${module.api_gateway_ai.stage_invoke_url}/ai/health"
}

# ============================================
# AI Lambda
# ============================================

output "lambda_ai_function_name" {
  description = "Lambda function name"
  value       = module.lambda_ai.function_name
}

# ============================================
# ECR OUTPUTS
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
# ALB CONTROLLER OUTPUTS
# ============================================
output "alb_controller_role_arn" {
  description = "IAM Role ARN for AWS Load Balancer Controller"
  value       = module.alb_controller.iam_role_arn
}

output "alb_controller_status" {
  description = "Helm release status for AWS Load Balancer Controller"
  value       = module.alb_controller.helm_release_status
}

# ============================================
# ECR OUTPUTS - FRONTEND
# ============================================
output "ecr_frontend_url" {
  description = "ECR URL for Frontend"
  value       = module.ecr.frontend_url
}

# ============================================
# ALB CONTROLLER OUTPUTS
# ============================================
output "alb_controller_role_arn" {
  description = "IAM Role ARN for AWS Load Balancer Controller"
  value       = module.alb_controller.iam_role_arn
}

output "alb_controller_status" {
  description = "Helm release status for AWS Load Balancer Controller"
  value       = module.alb_controller.helm_release_status
}

# ============================================
# ROUTE 53 OUTPUTS
# ============================================
output "route53_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = module.route53.zone_id
}

output "route53_name_servers" {
  description = "Name servers - CONFIGURE THESE IN HOSTINGER!"
  value       = module.route53.name_servers
}

# ============================================
# ACM OUTPUTS
# ============================================
output "acm_certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = module.acm.certificate_arn
}