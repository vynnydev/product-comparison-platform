# ============================================
# OPENSEARCH - BUSCA DE PRODUTOS
# Elasticsearch gerenciado pela AWS
# ============================================

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

locals {
  # prod-comp-dev-search = 20 chars ✓
  domain_name = "prod-comp-${var.environment}-search"
}

# ============================================
# SERVICE-LINKED ROLE FOR OPENSEARCH VPC ACCESS
# ============================================
resource "aws_iam_service_linked_role" "opensearch" {
  aws_service_name = "es.amazonaws.com"
  description      = "Service-linked role for OpenSearch VPC access"
}

# Security Group para OpenSearch
resource "aws_security_group" "opensearch" {
  name        = "${var.project_name}-${var.environment}-opensearch-sg"
  description = "Security group for OpenSearch"
  vpc_id      = var.vpc_id

  # HTTPS (OpenSearch API)
  ingress {
    description     = "HTTPS from EKS"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
  }

  # Acesso interno VPC
  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-opensearch-sg"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# IAM Policy Document for OpenSearch Access
data "aws_iam_policy_document" "opensearch_access" {
  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions   = ["es:*"]
    resources = ["arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/${local.domain_name}/*"]
  }
}

# OpenSearch Domain
resource "aws_opensearch_domain" "main" {
  domain_name    = local.domain_name
  engine_version = var.engine_version

  # Cluster Configuration
  cluster_config {
    instance_type            = var.instance_type
    instance_count           = var.instance_count
    zone_awareness_enabled   = var.instance_count > 1 ? true : false
    dedicated_master_enabled = var.dedicated_master_enabled
    dedicated_master_type    = var.dedicated_master_enabled ? var.dedicated_master_type : null
    dedicated_master_count   = var.dedicated_master_enabled ? 3 : null

    dynamic "zone_awareness_config" {
      for_each = var.instance_count > 1 ? [1] : []
      content {
        availability_zone_count = min(var.instance_count, 3)
      }
    }
  }

  # VPC Configuration
  vpc_options {
    subnet_ids         = var.instance_count > 1 ? slice(var.subnet_ids, 0, min(var.instance_count, 3)) : [var.subnet_ids[0]]
    security_group_ids = [aws_security_group.opensearch.id]
  }

  # EBS Storage
  ebs_options {
    ebs_enabled = true
    volume_type = var.volume_type
    volume_size = var.volume_size
    iops        = var.volume_type == "gp3" ? var.iops : null
    throughput  = var.volume_type == "gp3" ? var.throughput : null
  }

  # Encryption
  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  # Access Policy
  access_policies = data.aws_iam_policy_document.opensearch_access.json

  # Advanced Security (Fine-Grained Access Control)
  advanced_security_options {
    enabled                        = var.fine_grained_access_enabled
    internal_user_database_enabled = var.fine_grained_access_enabled
    
    dynamic "master_user_options" {
      for_each = var.fine_grained_access_enabled ? [1] : []
      content {
        master_user_name     = var.master_user_name
        master_user_password = var.master_user_password
      }
    }
  }

  # Domain Endpoint Options
  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  # Logging (opcional)
  dynamic "log_publishing_options" {
    for_each = var.enable_logging ? [1] : []
    content {
      cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch[0].arn
      log_type                 = "INDEX_SLOW_LOGS"
    }
  }

  # Auto-Tune (não suportado em t2/t3)
  auto_tune_options {
    desired_state       = var.enable_auto_tune ? "ENABLED" : "DISABLED"
    rollback_on_disable = "NO_ROLLBACK"
  }

  tags = {
    Name        = local.domain_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  # IMPORTANTE: Esperar a Service-Linked Role ser criada
  depends_on = [aws_iam_service_linked_role.opensearch]
}

# CloudWatch Log Group (opcional)
resource "aws_cloudwatch_log_group" "opensearch" {
  count             = var.enable_logging ? 1 : 0
  name              = "/aws/opensearch/${local.domain_name}"
  retention_in_days = 7

  tags = {
    Name        = "${local.domain_name}-logs"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Log Resource Policy
resource "aws_cloudwatch_log_resource_policy" "opensearch" {
  count       = var.enable_logging ? 1 : 0
  policy_name = "${local.domain_name}-log-policy"

  policy_document = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "es.amazonaws.com"
        }
        Action = [
          "logs:PutLogEvents",
          "logs:CreateLogStream"
        ]
        Resource = "${aws_cloudwatch_log_group.opensearch[0].arn}:*"
      }
    ]
  })
}