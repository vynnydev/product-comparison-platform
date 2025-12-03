# ============================================
# AMAZON MQ (RabbitMQ) FOR DEVELOPMENT
# ============================================

# Buscar IP público atual (para dev)
data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  my_ip = "${chomp(data.http.my_ip.response_body)}/32"
}

# Security Group for Amazon MQ
resource "aws_security_group" "amazonmq" {
  name_prefix = "${var.project_name}-${var.environment}-amazonmq-"
  description = "Security group for Amazon MQ RabbitMQ broker"
  vpc_id      = var.vpc_id

  # AMQPS port (SSL) from EKS nodes
  ingress {
    from_port       = 5671
    to_port         = 5671
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "AMQPS (SSL) from EKS nodes"
  }

  # AMQPS from VPC
  ingress {
    from_port   = 5671
    to_port     = 5671
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
    description = "AMQPS from VPC"
  }

  # Management console (HTTPS) from VPC
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
    description = "RabbitMQ Management Console from VPC"
  }

  # === ACESSO PÚBLICO PARA DESENVOLVIMENTO ===
  # Management console (HTTPS) from your IP
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.publicly_accessible ? [local.my_ip] : []
    description = "RabbitMQ Management Console from Developer IP"
  }

  # AMQPS from your IP (if needed)
  ingress {
    from_port   = 5671
    to_port     = 5671
    protocol    = "tcp"
    cidr_blocks = var.publicly_accessible ? [local.my_ip] : []
    description = "AMQPS from Developer IP"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-amazonmq-sg"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Amazon MQ Broker (RabbitMQ)
resource "aws_mq_broker" "rabbitmq" {
  broker_name = "${var.project_name}-${var.environment}-rabbitmq"

  engine_type        = "RabbitMQ"
  engine_version     = "3.13"
  host_instance_type = var.broker_instance_type
  
  deployment_mode = "SINGLE_INSTANCE"
  
  # Subnet pública se publicly_accessible = true
  subnet_ids          = [var.subnet_ids[0]]
  
  # CORREÇÃO: Security groups SÓ quando NÃO é público
  security_groups     = var.publicly_accessible ? [] : [aws_security_group.amazonmq.id]
  
  publicly_accessible = var.publicly_accessible

  user {
    username = var.broker_username
    password = var.broker_password
  }

  logs {
    general = true
  }

  auto_minor_version_upgrade = true
  maintenance_window_start_time {
    day_of_week = "SUNDAY"
    time_of_day = "03:00"
    time_zone   = "UTC"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rabbitmq"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# SSM Parameters
resource "aws_ssm_parameter" "rabbitmq_endpoint" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/endpoint"
  type  = "String"
  value = aws_mq_broker.rabbitmq.instances[0].endpoints[0]

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "rabbitmq_console_url" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/console_url"
  type  = "String"
  value = aws_mq_broker.rabbitmq.instances[0].console_url

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "rabbitmq_username" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/username"
  type  = "String"
  value = var.broker_username

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "rabbitmq_password" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/password"
  type  = "SecureString"
  value = var.broker_password

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}