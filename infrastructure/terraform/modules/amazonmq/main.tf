# ============================================
# AMAZON MQ (RabbitMQ) FOR PRODUCTION
# ============================================

# Security Group for Amazon MQ
resource "aws_security_group" "amazonmq" {
  name_prefix = "${var.project_name}-${var.environment}-amazonmq-"
  description = "Security group for Amazon MQ RabbitMQ broker"
  vpc_id      = var.vpc_id

  # AMQPS port (SSL)
  ingress {
    from_port       = 5671
    to_port         = 5671
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "AMQPS (SSL) from EKS nodes"
  }

  # Permitir da VPC inteira
  ingress {
    from_port   = 5671
    to_port     = 5671
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "AMQPS from VPC"
  }

  # Management console (HTTPS)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "RabbitMQ Management Console (HTTPS)"
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

  # Engine
  engine_type        = "RabbitMQ"
  engine_version     = "3.13"
  host_instance_type = var.broker_instance_type
  
  # Deployment
  deployment_mode = "SINGLE_INSTANCE"  # Use CLUSTER_MULTI_AZ for production
  
  # Network
  subnet_ids         = [var.subnet_ids[0]]  # Single AZ for SINGLE_INSTANCE
  security_groups    = [aws_security_group.amazonmq.id]
  publicly_accessible = false

  # Users
  user {
    username = var.broker_username
    password = var.broker_password
  }

  # Logs
  logs {
    general = true
  }

  # Maintenance
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

# SSM Parameter for RabbitMQ endpoint
resource "aws_ssm_parameter" "rabbitmq_endpoint" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/endpoint"
  type  = "String"
  value = aws_mq_broker.rabbitmq.instances[0].endpoints[0]

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# SSM Parameter for RabbitMQ username
resource "aws_ssm_parameter" "rabbitmq_username" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/username"
  type  = "String"
  value = var.broker_username

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# SSM Parameter for RabbitMQ password (SecureString)
resource "aws_ssm_parameter" "rabbitmq_password" {
  name  = "/${var.project_name}/${var.environment}/rabbitmq/password"
  type  = "SecureString"
  value = var.broker_password

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}