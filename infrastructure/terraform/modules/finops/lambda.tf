# ============================================
# LAMBDA - Cost Metrics Exporter
# Exporta métricas de custo para CloudWatch
# ============================================

# IAM Role
resource "aws_iam_role" "cost_exporter" {
  name = "${local.name_prefix}-cost-exporter-role"

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

  tags = local.cost_tags
}

resource "aws_iam_role_policy" "cost_exporter" {
  name = "${local.name_prefix}-cost-exporter-policy"
  role = aws_iam_role.cost_exporter.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CostExplorerAccess"
        Effect = "Allow"
        Action = [
          "ce:GetCostAndUsage",
          "ce:GetCostForecast",
          "ce:GetDimensionValues",
          "ce:GetTags",
          "ce:GetAnomalies",
          "ce:GetAnomalyMonitors"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchLogs"
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

# Lambda Function
resource "aws_lambda_function" "cost_exporter" {
  function_name = "${local.name_prefix}-cost-exporter"
  role          = aws_iam_role.cost_exporter.arn
  handler       = "index.handler"
  runtime       = "python3.11"
  timeout       = 60
  memory_size   = 256

  filename         = data.archive_file.cost_exporter.output_path
  source_code_hash = data.archive_file.cost_exporter.output_base64sha256

  environment {
    variables = {
      PROJECT_NAME = var.project_name
      ENVIRONMENT  = var.environment
    }
  }

  tags = local.cost_tags
}

# Lambda Code
data "archive_file" "cost_exporter" {
  type        = "zip"
  output_path = "${path.module}/lambda/cost_exporter.zip"

  source {
    content  = <<-EOF
import boto3
import json
from datetime import datetime, timedelta

def handler(event, context):
    ce = boto3.client('ce')
    cloudwatch = boto3.client('cloudwatch')
    
    # Datas
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    project_name = event.get('PROJECT_NAME', 'product-comparison')
    
    # Obter custos por serviço
    response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': start_date,
            'End': end_date
        },
        Granularity='DAILY',
        Metrics=['UnblendedCost'],
        GroupBy=[
            {'Type': 'DIMENSION', 'Key': 'SERVICE'}
        ],
        Filter={
            'Tags': {
                'Key': 'Project',
                'Values': [project_name]
            }
        }
    )
    
    # Processar e enviar métricas
    for result in response['ResultsByTime']:
        date = result['TimePeriod']['Start']
        
        for group in result['Groups']:
            service = group['Keys'][0]
            cost = float(group['Metrics']['UnblendedCost']['Amount'])
            
            # Enviar para CloudWatch
            cloudwatch.put_metric_data(
                Namespace='FinOps/Costs',
                MetricData=[
                    {
                        'MetricName': 'DailyCost',
                        'Dimensions': [
                            {'Name': 'Project', 'Value': project_name},
                            {'Name': 'Service', 'Value': service}
                        ],
                        'Value': cost,
                        'Unit': 'None',
                        'Timestamp': datetime.strptime(date, '%Y-%m-%d')
                    }
                ]
            )
    
    # Obter custo total do mês
    month_start = datetime.now().replace(day=1).strftime('%Y-%m-%d')
    
    total_response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': month_start,
            'End': end_date
        },
        Granularity='MONTHLY',
        Metrics=['UnblendedCost'],
        Filter={
            'Tags': {
                'Key': 'Project',
                'Values': [project_name]
            }
        }
    )
    
    total_cost = 0
    for result in total_response['ResultsByTime']:
        total_cost = float(result['Total']['UnblendedCost']['Amount'])
    
    cloudwatch.put_metric_data(
        Namespace='FinOps/Costs',
        MetricData=[
            {
                'MetricName': 'MonthlyTotalCost',
                'Dimensions': [
                    {'Name': 'Project', 'Value': project_name}
                ],
                'Value': total_cost,
                'Unit': 'None'
            }
        ]
    )
    
    # Obter forecast
    try:
        forecast_response = ce.get_cost_forecast(
            TimePeriod={
                'Start': end_date,
                'End': (datetime.now().replace(day=1) + timedelta(days=32)).replace(day=1).strftime('%Y-%m-%d')
            },
            Metric='UNBLENDED_COST',
            Granularity='MONTHLY',
            Filter={
                'Tags': {
                    'Key': 'Project',
                    'Values': [project_name]
                }
            }
        )
        
        forecast_cost = float(forecast_response['Total']['Amount'])
        
        cloudwatch.put_metric_data(
            Namespace='FinOps/Costs',
            MetricData=[
                {
                    'MetricName': 'MonthlyForecast',
                    'Dimensions': [
                        {'Name': 'Project', 'Value': project_name}
                    ],
                    'Value': forecast_cost,
                    'Unit': 'None'
                }
            ]
        )
    except Exception as e:
        print(f"Forecast error: {e}")
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Cost metrics exported successfully',
            'total_cost': total_cost
        })
    }
EOF
    filename = "index.py"
  }
}

# CloudWatch Event Rule - Executar diariamente
resource "aws_cloudwatch_event_rule" "cost_exporter" {
  name                = "${local.name_prefix}-cost-exporter-schedule"
  description         = "Trigger cost exporter Lambda daily"
  schedule_expression = "cron(0 6 * * ? *)" # 6 AM UTC diariamente

  tags = local.cost_tags
}

resource "aws_cloudwatch_event_target" "cost_exporter" {
  rule      = aws_cloudwatch_event_rule.cost_exporter.name
  target_id = "cost-exporter"
  arn       = aws_lambda_function.cost_exporter.arn

  input = jsonencode({
    PROJECT_NAME = var.project_name
  })
}

resource "aws_lambda_permission" "cost_exporter" {
  statement_id  = "AllowEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cost_exporter.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.cost_exporter.arn
}

# ============================================
# LAMBDA - Slack Notifier (opcional)
# ============================================

resource "aws_lambda_function" "slack_notifier" {
  count         = var.slack_webhook_url != "" ? 1 : 0
  function_name = "${local.name_prefix}-cost-slack-notifier"
  role          = aws_iam_role.cost_exporter.arn
  handler       = "index.handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 128

  filename         = data.archive_file.slack_notifier[0].output_path
  source_code_hash = data.archive_file.slack_notifier[0].output_base64sha256

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
    }
  }

  tags = local.cost_tags
}

data "archive_file" "slack_notifier" {
  count       = var.slack_webhook_url != "" ? 1 : 0
  type        = "zip"
  output_path = "${path.module}/lambda/slack_notifier.zip"

  source {
    content  = <<-EOF
import json
import os
import urllib.request

def handler(event, context):
    webhook_url = os.environ['SLACK_WEBHOOK_URL']
    
    # Parse SNS message
    message = json.loads(event['Records'][0]['Sns']['Message'])
    
    # Format Slack message
    slack_message = {
        'attachments': [{
            'color': '#FF9900',
            'title': '💰 AWS Cost Alert',
            'text': json.dumps(message, indent=2),
            'footer': 'AWS Cost Management'
        }]
    }
    
    # Send to Slack
    req = urllib.request.Request(
        webhook_url,
        data=json.dumps(slack_message).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    urllib.request.urlopen(req)
    
    return {'statusCode': 200}
EOF
    filename = "index.py"
  }
}

resource "aws_lambda_permission" "slack_notifier" {
  count         = var.slack_webhook_url != "" ? 1 : 0
  statement_id  = "AllowSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.slack_notifier[0].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.cost_alerts.arn
}