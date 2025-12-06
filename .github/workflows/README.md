# 🆘 Disaster Recovery Workflows

Este diretório contém os workflows de GitHub Actions para Disaster Recovery.

## 📋 Workflows Disponíveis

### 1. `disaster-recovery.yml`

**Trigger**: Manual ou via webhook (Alertmanager)

**Ações**:
- `plan` - Apenas mostra o que seria alterado
- `apply` - Aplica as alterações do Terraform
- `destroy-and-recreate` - Destrói e recria o componente

**Componentes**:
- `all` - Toda a infraestrutura
- `eks` - Cluster EKS
- `rds` - Banco de dados RDS
- `elasticache` - Redis
- `opensearch` - OpenSearch
- `rabbitmq` - Amazon MQ

### 2. `dr-health-check.yml`

**Trigger**: A cada 6 horas ou manual

**Verifica**:
- Status do EKS Cluster
- Nodes disponíveis
- Pods em execução
- RDS disponibilidade
- Redis disponibilidade
- OpenSearch status

### 3. `dr-backup-restore.yml`

**Trigger**: Manual

**Operações**:
- `create-backup` - Cria snapshot
- `list-backups` - Lista snapshots disponíveis
- `restore-backup` - Restaura de um snapshot

## 🔐 Secrets Necessários

Configure estes secrets no GitHub:

| Secret | Descrição |
|--------|-----------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key |
| `SLACK_WEBHOOK_URL` | URL do Slack Webhook |

## 🚀 Uso

### Trigger Manual

1. Vá para **Actions** no GitHub
2. Selecione o workflow desejado
3. Clique em **Run workflow**
4. Preencha os parâmetros
5. Clique em **Run workflow**

### Trigger via Webhook
```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{
    "event_type": "disaster-recovery",
    "client_payload": {
      "component": "rds",
      "action": "apply",
      "environment": "dev"
    }
  }'
```

## 📊 Fluxo de Recuperação
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Alerta    │────▶│   Webhook   │────▶│   GitHub    │
│ Alertmanager│     │   Trigger   │     │   Actions   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┤
                    │                          │
                    ▼                          ▼
             ┌─────────────┐           ┌─────────────┐
             │   Validate  │           │   Approval  │
             │    & Plan   │           │  (if prod)  │
             └──────┬──────┘           └──────┬──────┘
                    │                          │
                    └──────────┬───────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Terraform │
                        │    Apply    │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │  Validate   │
                        │   Health    │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Notify    │
                        │    Slack    │
                        └─────────────┘
```