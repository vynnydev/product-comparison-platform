# ============================================
# VPC Module
# ============================================
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  azs          = var.availability_zones
}

# ============================================
# ECR Module
# ============================================
module "ecr" {
  source = "./modules/ecr"
  
  project_name = var.project_name
  environment  = var.environment
}

# ============================================
# IAM Module
# ============================================
module "iam" {
  source = "./modules/iam"
  
  project_name = var.project_name
  environment  = var.environment
}

# ============================================
# EKS Module
# ============================================
module "eks" {
  source = "./modules/eks"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  cluster_role_arn   = module.iam.eks_cluster_role_arn
  node_role_arn      = module.iam.eks_node_role_arn
}

# ============================================
# AMAZON MQ (RABBITMQ)
# ============================================

module "amazonmq" {
  source = "./modules/amazonmq"

  project_name = var.project_name
  environment  = var.environment
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids

  broker_instance_type = "mq.t3.micro"
  broker_username      = var.rabbitmq_username
  broker_password      = var.rabbitmq_password

  allowed_security_group_ids = [module.eks.node_security_group_id]
}

# ============================================
# RDS POSTGRESQL
# ============================================

module "rds" {
  source = "./modules/rds"

  project_name = var.project_name
  environment  = var.environment

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids

  db_instance_class       = "db.t3.micro"
  db_name                 = "productdb"
  db_username             = var.db_username
  db_password             = var.db_password
  allocated_storage       = 20
  backup_retention_period = 7
  multi_az                = false  # true para prod

  allowed_security_group_ids = [module.eks.node_security_group_id]
}