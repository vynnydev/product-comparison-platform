# 💰 FinOps Module - Cost Management

Este módulo implementa uma solução completa de **FinOps (Financial Operations)** para gerenciamento de custos na AWS, incluindo budgets, detecção de anomalias, métricas customizadas e dashboards.

## 📊 Arquitetura
```
┌─────────────────────────────────────────────────────────────────────┐
│                        FINOPS ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐ │
│  │  AWS Cost       │────▶│  Lambda         │────▶│  CloudWatch   │ │
│  │  Explorer API   │     │  Cost Exporter  │     │  Metrics      │ │
│  └─────────────────┘     └─────────────────┘     └───────┬───────┘ │
│                                                          │         │
│  ┌─────────────────┐     ┌─────────────────┐             │         │
│  │  AWS Budgets    │────▶│  SNS Topic      │─────────────┤         │
│  │  (Alerts)       │     │  (Notifications)│             │         │
│  └─────────────────┘     └─────────────────┘             │         │
│                                                          ▼         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐ │
│  │  Cost Anomaly   │────▶│  EventBridge    │────▶│  Grafana      │ │
│  │  Detection      │     │                 │     │  Dashboard    │ │
│  └─────────────────┘     └─────────────────┘     └───────────────┘ │
│                                                          │         │
│                                                          ▼         │
│                                                  ┌───────────────┐ │
│                                                  │ Slack/Discord │ │
│                                                  │ Notifications │ │
│                                                  └───────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Recursos Implementados

### 1. **AWS Budgets**
Alertas automáticos quando os custos atingem determinados thresholds:

| Budget | Descrição | Alertas |
|--------|-----------|---------|
| Monthly Total | Custo total do projeto | 50%, 80%, 100% |
| EKS | Custos do Kubernetes | 80% |
| RDS | Custos do banco de dados | 80% |
| EC2 | Custos de compute | 80% |
| Data Transfer | Custos de transferência | 80% |

### 2. **Cost Anomaly Detection**
Detecção automática de gastos anormais:

- **Monitor por Serviço**: Detecta anomalias em qualquer serviço AWS
- **Monitor por Projeto**: Detecta anomalias específicas do projeto (via tags)
- **Alertas Diários**: Notificações quando o impacto excede o threshold

### 3. **Lambda Cost Exporter**
Função Lambda que exporta métricas de custo para o CloudWatch:

- **Execução**: Diária às 6:00 AM UTC
- **Métricas Exportadas**:
  - `DailyCost` - Custo diário por serviço
  - `MonthlyTotalCost` - Custo total do mês (MTD)
  - `MonthlyForecast` - Previsão de custo mensal

### 4. **Cost Allocation Tags**
Tags ativadas para alocação de custos:

- `Project` - Nome do projeto
- `Environment` - Ambiente (dev, staging, prod)
- `CostCenter` - Centro de custo
- `Owner` - Responsável

### 5. **Grafana Dashboard**
Dashboard visual com:

- Custo mensal atual (MTD)
- Previsão de custo mensal
- Gauge de uso do budget
- Gráfico de custo diário por serviço
- Pie chart de distribuição de custos
- Tabela detalhada por serviço

## 📋 Uso

### Variáveis
```hcl
module "finops" {
  source = "./modules/finops"

  # Identificação
  project_name = "product-comparison"
  environment  = "dev"
  cost_center  = "engineering"
  owner        = "devops"

  # Limites de Budget (USD)
  monthly_budget_limit       = "300"  # Total mensal
  eks_budget_limit           = "100"  # EKS
  rds_budget_limit           = "30"   # RDS
  ec2_budget_limit           = "80"   # EC2
  data_transfer_budget_limit = "20"   # Data Transfer

  # Anomaly Detection
  anomaly_threshold_amount = "10"  # Alerta se impacto > $10

  # Notificações
  alert_emails      = ["devops@example.com"]
  slack_webhook_url = "https://hooks.slack.com/services/..."
}
```

### Outputs
```hcl
output "finops_sns_topic_arn" {
  value = module.finops.sns_topic_arn
}

output "finops_budget_name" {
  value = module.finops.monthly_budget_name
}

output "finops_cloudwatch_namespace" {
  value = module.finops.cloudwatch_namespace  # "FinOps/Costs"
}
```

## 📊 Métricas no CloudWatch

### Namespace: `FinOps/Costs`

| Métrica | Dimensões | Descrição |
|---------|-----------|-----------|
| `DailyCost` | Project, Service | Custo diário por serviço |
| `MonthlyTotalCost` | Project | Custo total do mês |
| `MonthlyForecast` | Project | Previsão de custo |

### Queries de Exemplo
```sql
-- Custo total do mês
SELECT MAX(MonthlyTotalCost) 
FROM "FinOps/Costs" 
WHERE Project = 'product-comparison'

-- Custo por serviço (últimos 7 dias)
SELECT SUM(DailyCost) 
FROM "FinOps/Costs" 
WHERE Project = 'product-comparison'
GROUP BY Service
```

## 🔔 Notificações

### Tipos de Alertas

1. **Budget Alerts**
   - 50% do budget atingido
   - 80% do budget atingido
   - 100% do budget atingido
   - Forecast excede 100%

2. **Anomaly Alerts**
   - Custo anormal detectado (impacto > threshold)

### Canais Suportados

- ✅ Email (SNS)
- ✅ Slack (via Lambda)
- ✅ Discord (via webhook)

### Exemplo de Alerta Slack
```
💰 AWS Cost Alert
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Budget Alert: 80% threshold reached

Budget: product-comparison-dev-monthly-total
Current Spend: $240.00
Budget Limit: $300.00
Percentage: 80%

Action Required: Review spending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📈 Dashboard Grafana

### Acessar o Dashboard
```bash
# Port-forward do Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring

# Acessar
open http://localhost:3000/d/finops-costs
```

### Painéis Disponíveis

1. **Monthly Cost (MTD)** - Stat panel com custo atual
2. **Monthly Forecast** - Stat panel com previsão
3. **Budget Usage** - Gauge com % do budget
4. **Daily Cost by Service** - Time series empilhado
5. **Cost Distribution** - Pie chart por serviço
6. **Cost Table** - Tabela detalhada

## 💡 Boas Práticas FinOps

### 1. Tagging Strategy

Sempre aplique tags consistentes:
```hcl
tags = {
  Project     = "product-comparison"
  Environment = "dev"
  CostCenter  = "engineering"
  Owner       = "devops"
  ManagedBy   = "Terraform"
}
```

### 2. Right-Sizing

Revise periodicamente:
- Instâncias EC2 subutilizadas
- RDS over-provisioned
- ElastiCache nodes ociosos

### 3. Reserved Instances / Savings Plans

Para produção, considere:
- EC2 Reserved Instances (até 72% desconto)
- Savings Plans (até 66% desconto)
- RDS Reserved Instances

### 4. Spot Instances

Para workloads tolerantes a interrupção:
- EKS Node Groups com Spot
- Batch processing
- Dev/Test environments

## 💰 Estimativa de Custos do Módulo

| Recurso | Custo Estimado |
|---------|----------------|
| AWS Budgets | Grátis (primeiros 2 budgets) |
| Cost Anomaly Detection | Grátis |
| Lambda (Cost Exporter) | ~$0.10/mês |
| CloudWatch Metrics | ~$0.30/mês |
| SNS Notifications | ~$0.50/mês |
| **Total** | **~$1.00/mês** |

## 🔧 Troubleshooting

### Lambda não está exportando métricas
```bash
# Verificar logs da Lambda
aws logs tail /aws/lambda/product-comparison-dev-cost-exporter --follow

# Executar manualmente
aws lambda invoke \
  --function-name product-comparison-dev-cost-exporter \
  --payload '{"PROJECT_NAME": "product-comparison"}' \
  response.json
```

### Métricas não aparecem no Grafana

1. Verificar se o datasource CloudWatch está configurado
2. Verificar namespace: `FinOps/Costs`
3. Verificar dimensão: `Project = product-comparison`

### Alertas não estão chegando
```bash
# Verificar subscription do SNS
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT:product-comparison-dev-cost-alerts

# Testar publicação
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT:product-comparison-dev-cost-alerts \
  --message "Test alert"
```

## 📚 Referências

- [AWS Cost Explorer API](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-api.html)
- [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)
- [Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html)
- [FinOps Foundation](https://www.finops.org/)
- [AWS Well-Architected - Cost Optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)

---

**Maintainer**: Vini  
**Last Updated**: December 2024  
**Version**: 1.0.0