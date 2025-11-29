# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "${var.project_name}-${var.environment}"
  version  = var.kubernetes_version
  role_arn = var.cluster_role_arn
  
  vpc_config {
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]
  }
  
  enabled_cluster_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]
  
  tags = {
    Name = "${var.project_name}-${var.environment}"
  }
  
  depends_on = [
    var.cluster_role_arn
  ]
}

# Security Group para Nodes
resource "aws_security_group" "node" {
  name        = "${var.project_name}-${var.environment}-node-sg"
  description = "Security group for EKS nodes"
  vpc_id      = var.vpc_id
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-node-sg"
    "kubernetes.io/cluster/${var.project_name}-${var.environment}" = "owned"
  }
}

resource "aws_security_group_rule" "node_ingress_self" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  security_group_id = aws_security_group.node.id
  source_security_group_id = aws_security_group.node.id
  description       = "Allow nodes to communicate with each other"
}

resource "aws_security_group_rule" "node_ingress_cluster" {
  type              = "ingress"
  from_port         = 1025
  to_port           = 65535
  protocol          = "tcp"
  security_group_id = aws_security_group.node.id
  source_security_group_id = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
  description       = "Allow pods to receive communication from cluster control plane"
}

# Node Group
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project_name}-${var.environment}-node-group"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.private_subnet_ids
  
  instance_types = var.node_instance_types
  ami_type = "AL2023_x86_64_STANDARD"
  
  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }
  
  update_config {
    max_unavailable = 1
  }
  
  labels = {
    role        = "general"
    environment = var.environment
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-node-group"
  }
  
  depends_on = [
    var.node_role_arn
  ]
}

# OIDC Provider para Service Accounts
data "tls_certificate" "cluster" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "cluster" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.cluster.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.main.identity[0].oidc[0].issuer
  
  tags = {
    Name = "${var.project_name}-${var.environment}-oidc"
  }
}