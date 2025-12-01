# ============================================
# RDS POSTGRESQL FOR PRODUCTION
# ============================================

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-subnet"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-${var.environment}-rds-"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  # Permitir do Security Group dos nodes EKS
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "PostgreSQL from EKS nodes"
  }

  # Permitir da VPC inteira (subnets privadas)
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "PostgreSQL from VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgresql" {
  identifier = "${var.project_name}-${var.environment}-postgresql"

  # Engine
  engine         = "postgres"
  engine_version = "15.7"
  instance_class = var.db_instance_class

  # Storage
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.allocated_storage * 2  # Auto-scaling up to 2x
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 5432

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # High Availability
  multi_az = var.multi_az

  # Backup
  backup_retention_period = var.backup_retention_period
  backup_window           = "03:00-04:00"  # UTC
  maintenance_window      = "sun:04:00-sun:05:00"
  skip_final_snapshot     = var.environment == "dev" ? true : false
  final_snapshot_identifier = var.environment != "dev" ? "${var.project_name}-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = true
  performance_insights_retention_period = 7

  # Updates
  auto_minor_version_upgrade = true
  apply_immediately          = var.environment == "dev" ? true : false

  tags = {
    Name        = "${var.project_name}-${var.environment}-postgresql"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# SSM Parameters
resource "aws_ssm_parameter" "db_endpoint" {
  name  = "/${var.project_name}/${var.environment}/rds/endpoint"
  type  = "String"
  value = aws_db_instance.postgresql.endpoint

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "db_name" {
  name  = "/${var.project_name}/${var.environment}/rds/database"
  type  = "String"
  value = aws_db_instance.postgresql.db_name

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "db_username" {
  name  = "/${var.project_name}/${var.environment}/rds/username"
  type  = "String"
  value = var.db_username

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/${var.project_name}/${var.environment}/rds/password"
  type  = "SecureString"
  value = var.db_password

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}