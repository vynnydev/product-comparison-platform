# ============================================
# LAMBDA MODULE
# AWS Lambda Function for AI Service
# ============================================

# --------------------------------------------
# DATA SOURCES
# --------------------------------------------
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# --------------------------------------------
# IAM ROLE FOR LAMBDA
# --------------------------------------------
resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-${var.environment}-${var.function_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# CloudWatch Logs Policy
resource "aws_iam_role_policy" "lambda_logs" {
  name = "${var.project_name}-${var.environment}-${var.function_name}-logs"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Bedrock Policy (optional)
resource "aws_iam_role_policy" "lambda_bedrock" {
  count = var.enable_bedrock ? 1 : 0

  name = "${var.project_name}-${var.environment}-${var.function_name}-bedrock"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = [
          "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/${var.bedrock_model_id}",
          "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/anthropic.*"
        ]
      }
    ]
  })
}

# VPC Policy (optional)
resource "aws_iam_role_policy" "lambda_vpc" {
  count = var.vpc_id != null ? 1 : 0

  name = "${var.project_name}-${var.environment}-${var.function_name}-vpc"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:AssignPrivateIpAddresses",
          "ec2:UnassignPrivateIpAddresses"
        ]
        Resource = "*"
      }
    ]
  })
}

# --------------------------------------------
# LAMBDA FUNCTION
# --------------------------------------------
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/src/lambda.zip"
}

resource "aws_lambda_function" "main" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "${var.project_name}-${var.environment}-${var.function_name}"
  role             = aws_iam_role.lambda.arn
  handler          = var.handler
  runtime          = var.runtime
  timeout          = var.timeout
  memory_size      = var.memory_size
  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = merge(var.environment_variables, {
      ENVIRONMENT = var.environment
    })
  }

  # VPC Configuration (optional)
  dynamic "vpc_config" {
    for_each = var.vpc_id != null ? [1] : []
    content {
      subnet_ids         = var.private_subnet_ids
      security_group_ids = [aws_security_group.lambda[0].id]
    }
  }

  tags = var.tags
}

# Security Group for Lambda (if in VPC)
resource "aws_security_group" "lambda" {
  count = var.vpc_id != null ? 1 : 0

  name        = "${var.project_name}-${var.environment}-${var.function_name}-sg"
  description = "Security group for Lambda function ${var.function_name}"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-${var.function_name}-sg"
  })
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.main.function_name}"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# --------------------------------------------
# SSM PARAMETERS
# --------------------------------------------
resource "aws_ssm_parameter" "lambda_arn" {
  name  = "/${var.project_name}/${var.environment}/lambda/${var.function_name}/arn"
  type  = "String"
  value = aws_lambda_function.main.arn

  tags = var.tags
}