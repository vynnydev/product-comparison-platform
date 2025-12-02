# ============================================
# ECR REPOSITORIES - Um por microserviço
# ============================================

locals {
  repositories = [
    "product-service",
    "ai-service",
    "frontend"  # NEW: Added frontend repository
  ]
}

resource "aws_ecr_repository" "services" {
  for_each             = toset(local.repositories)
  name                 = "${var.project_name}-${var.environment}-${each.value}"
  image_tag_mutability = var.image_tag_mutability
  
  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }
  
  encryption_configuration {
    encryption_type = var.encryption_type
  }
  
  tags = {
    Name    = "${var.project_name}-${var.environment}-${each.value}"
    Service = each.value
  }
}

resource "aws_ecr_lifecycle_policy" "services" {
  for_each   = toset(local.repositories)
  repository = aws_ecr_repository.services[each.value].name
  
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last ${var.lifecycle_policy_count} images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = var.lifecycle_policy_count
      }
      action = {
        type = "expire"
      }
    }]
  })
}