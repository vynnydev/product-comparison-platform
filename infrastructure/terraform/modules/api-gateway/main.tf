# ============================================
# API GATEWAY MODULE
# AWS API Gateway HTTP API
# ============================================

# --------------------------------------------
# DATA SOURCES
# --------------------------------------------
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# --------------------------------------------
# API GATEWAY HTTP API
# --------------------------------------------
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-${var.environment}-${var.api_name}"
  protocol_type = "HTTP"
  description   = var.api_description

  cors_configuration {
    allow_origins     = var.cors_allow_origins
    allow_methods     = var.cors_allow_methods
    allow_headers     = var.cors_allow_headers
    expose_headers    = var.cors_expose_headers
    max_age           = var.cors_max_age
    allow_credentials = var.cors_allow_credentials
  }

  tags = var.tags
}

# --------------------------------------------
# LAMBDA INTEGRATION
# --------------------------------------------
resource "aws_apigatewayv2_integration" "lambda" {
  for_each = var.lambda_integrations

  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  description            = each.value.description
}

# --------------------------------------------
# ROUTES
# --------------------------------------------
resource "aws_apigatewayv2_route" "routes" {
  for_each = var.routes

  api_id    = aws_apigatewayv2_api.main.id
  route_key = each.value.route_key
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.value.integration_key].id}"

  authorization_type = each.value.authorization_type
  authorizer_id      = each.value.authorizer_id
}

# --------------------------------------------
# STAGE
# --------------------------------------------
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.stage_name
  auto_deploy = var.auto_deploy

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      httpMethod       = "$context.httpMethod"
      routeKey         = "$context.routeKey"
      status           = "$context.status"
      responseLength   = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
      errorMessage     = "$context.error.message"
    })
  }

  default_route_settings {
    throttling_burst_limit = var.throttling_burst_limit
    throttling_rate_limit  = var.throttling_rate_limit
  }

  tags = var.tags
}

# --------------------------------------------
# CLOUDWATCH LOG GROUP
# --------------------------------------------
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}-${var.api_name}"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# --------------------------------------------
# LAMBDA PERMISSIONS
# --------------------------------------------
resource "aws_lambda_permission" "api_gateway" {
  for_each = var.lambda_integrations

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# --------------------------------------------
# SSM PARAMETERS
# --------------------------------------------
resource "aws_ssm_parameter" "api_endpoint" {
  name  = "/${var.project_name}/${var.environment}/api-gateway/${var.api_name}/endpoint"
  type  = "String"
  value = aws_apigatewayv2_stage.main.invoke_url

  tags = var.tags
}

resource "aws_ssm_parameter" "api_id" {
  name  = "/${var.project_name}/${var.environment}/api-gateway/${var.api_name}/id"
  type  = "String"
  value = aws_apigatewayv2_api.main.id

  tags = var.tags
}