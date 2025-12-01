# ============================================
# AWS BEDROCK MODULE
# IAM Roles and Policies for EKS Access
# ============================================

# Data source para obter informações do caller
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# IAM POLICY FOR BEDROCK ACCESS
# ============================================

resource "aws_iam_policy" "bedrock_invoke" {
  name        = "${var.project_name}-${var.environment}-bedrock-invoke"
  description = "Policy to invoke Amazon Bedrock models"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "BedrockInvokeModel"
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = [
          "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/${var.bedrock_model_id}",
          "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/*"
        ]
      },
      {
        Sid    = "BedrockListModels"
        Effect = "Allow"
        Action = [
          "bedrock:ListFoundationModels",
          "bedrock:GetFoundationModel"
        ]
        Resource = "*"
      },
      {
        Sid    = "BedrockModelAccess"
        Effect = "Allow"
        Action = [
          "bedrock:ListFoundationModelAgreementOffers",
          "bedrock:GetFoundationModelAvailability"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-bedrock-invoke"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# IAM ROLE FOR EKS SERVICE ACCOUNT (IRSA)
# ============================================

# Trust policy para IRSA
data "aws_iam_policy_document" "bedrock_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = [var.oidc_provider_arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "${replace(var.oidc_provider_arn, "/^(.*provider/)/", "")}:sub"
      values   = ["system:serviceaccount:${var.k8s_namespace}:${var.k8s_service_account}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(var.oidc_provider_arn, "/^(.*provider/)/", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "bedrock_access" {
  name               = "${var.project_name}-${var.environment}-bedrock-access"
  assume_role_policy = data.aws_iam_policy_document.bedrock_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-bedrock-access"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Purpose     = "EKS IRSA for Bedrock access"
  }
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "bedrock_invoke" {
  policy_arn = aws_iam_policy.bedrock_invoke.arn
  role       = aws_iam_role.bedrock_access.name
}

# ============================================
# CLOUDWATCH LOGGING FOR BEDROCK (Optional)
# ============================================

resource "aws_cloudwatch_log_group" "bedrock_logs" {
  count = var.enable_logging ? 1 : 0

  name              = "/aws/bedrock/${var.project_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-${var.environment}-bedrock-logs"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================
# SSM PARAMETERS
# ============================================

resource "aws_ssm_parameter" "bedrock_model_id" {
  name  = "/${var.project_name}/${var.environment}/bedrock/model-id"
  type  = "String"
  value = var.bedrock_model_id

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "bedrock_role_arn" {
  name  = "/${var.project_name}/${var.environment}/bedrock/role-arn"
  type  = "String"
  value = aws_iam_role.bedrock_access.arn

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_ssm_parameter" "bedrock_region" {
  name  = "/${var.project_name}/${var.environment}/bedrock/region"
  type  = "String"
  value = data.aws_region.current.name

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
