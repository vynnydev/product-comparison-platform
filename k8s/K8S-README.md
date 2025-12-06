# 📁 Kubernetes (k8s) - Product Comparison Platform

Este diretório contém toda a configuração Kubernetes para o deploy da plataforma Product Comparison.

## 📊 Arquitetura de Namespaces
```
┌─────────────────────────────────────────────────────────────────────┐
│                         EKS CLUSTER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │  product-platform   │  │     monitoring      │                  │
│  │  ─────────────────  │  │  ─────────────────  │                  │
│  │  • product-service  │  │  • prometheus       │                  │
│  │  • ai-service       │  │  • grafana          │                  │
│  │  • search-service   │  │  • loki             │                  │
│  │  • frontend         │  │  • promtail         │                  │
│  │                     │  │  • alertmanager     │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │      quality        │  │       argocd        │                  │
│  │  ─────────────────  │  │  ─────────────────  │                  │
│  │  • sonarqube        │  │  • argocd-server    │                  │
│  │                     │  │  • argocd-repo      │                  │
│  │                     │  │  • argocd-app-ctrl  │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │        data         │  │      security       │                  │
│  │  ─────────────────  │  │  ─────────────────  │                  │
│  │  • opensearch-proxy │  │  • security-dash    │                  │
│  │                     │  │  • alerting         │                  │
│  │                     │  │  • dr-controller    │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Diretórios
```
k8s/
├── apps/                    # Microserviços da aplicação
│   ├── product-service/     # API de produtos
│   ├── ai-service/          # Serviço de IA (Bedrock)
│   ├── search-service/      # Busca (OpenSearch + Redis)
│   ├── frontend/            # Next.js frontend
│   └── kustomization.yaml
│
├── argocd/                  # GitOps - ArgoCD
│   ├── install/             # Instalação do ArgoCD
│   ├── apps/                # Application definitions
│   ├── projects/            # AppProjects
│   ├── config/              # Configurações
│   └── kustomization.yaml
│
├── base/                    # Recursos base compartilhados
│   ├── namespaces/          # Definição de namespaces
│   ├── configmaps/          # ConfigMaps compartilhados
│   ├── secrets/             # Secrets compartilhados
│   └── kustomization.yaml
│
├── data/                    # Ferramentas de dados
│   ├── opensearch-proxy/    # Proxy para OpenSearch Dashboard
│   └── kustomization.yaml
│
├── ingress/                 # Configuração de Ingress
│   ├── alb-controller/      # AWS ALB Controller
│   ├── ingress-apps.yaml    # Ingress dos apps
│   ├── ingress-monitoring.yaml
│   └── kustomization.yaml
│
├── monitoring/              # Stack de observabilidade
│   ├── prometheus/          # Métricas
│   ├── grafana/             # Dashboards
│   ├── loki/                # Logs
│   ├── promtail/            # Log collector
│   ├── alertmanager/        # Alertas
│   └── kustomization.yaml
│
├── overlays/                # Configurações por ambiente
│   ├── dev/                 # Desenvolvimento
│   ├── staging/             # Staging
│   └── prod/                # Produção
│
├── quality/                 # Qualidade de código
│   ├── sonarqube/           # SonarQube
│   └── kustomization.yaml
│
├── security/                # Segurança e DR
│   ├── security-dashboard/  # Dashboard de segurança
│   ├── alerting/            # Configuração de alertas
│   ├── disaster-recovery/   # Controlador de DR
│   └── kustomization.yaml
│
├── scripts/                 # Scripts de deploy
│   ├── deploy-all.sh
│   ├── deploy-apps.sh
│   ├── deploy-monitoring.sh
│   ├── deploy-argocd.sh
│   ├── deploy-security.sh
│   ├── status.sh
│   ├── port-forward.sh
│   └── cleanup.sh
│
└── kustomization.yaml       # Kustomization raiz
```

## 📦 Componentes

### 🔷 apps/ - Microserviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| product-service | 8080 | API REST para gerenciamento de produtos |
| ai-service | 8081 | Integração com AWS Bedrock para análise IA |
| search-service | 8082 | Busca com OpenSearch e cache Redis |
| frontend | 3000 | Interface Next.js |

**Arquivos por serviço:**
- `configmap.yaml` - Configurações não-sensíveis
- `secret.yaml` - Credenciais (quando necessário)
- `deployment.yaml` - Definição do Deployment
- `service.yaml` - Exposição interna (ClusterIP)
- `serviceaccount.yaml` - ServiceAccount com IRSA
- `hpa.yaml` - Horizontal Pod Autoscaler
- `kustomization.yaml` - Agregação Kustomize

### 🔷 monitoring/ - Observabilidade

| Componente | Função |
|------------|--------|
| Prometheus | Coleta e armazenamento de métricas |
| Grafana | Visualização e dashboards |
| Loki | Agregação de logs |
| Promtail | Coleta de logs dos pods |
| Alertmanager | Gerenciamento de alertas |

### 🔷 security/ - Segurança

| Componente | Função |
|------------|--------|
| security-dashboard | Dashboard Grafana com métricas de segurança (WAF, GuardDuty) |
| alerting | Configuração de alertas para Slack e PagerDuty |
| disaster-recovery | Controlador automático de recuperação |

### 🔷 overlays/ - Ambientes

Usa Kustomize para sobrescrever configurações por ambiente:

| Ambiente | Replicas | Resources | Features |
|----------|----------|-----------|----------|
| dev | 1 | Mínimos | Debug enabled |
| staging | 2 | Moderados | Tracing enabled |
| prod | 3 | Máximos | Otimizado |

## 🚀 Deploy

### Deploy completo (interativo)
```bash
cd k8s/scripts
./deploy-all.sh
```

### Deploy por componente
```bash
# Base (namespaces, configmaps, secrets)
kubectl apply -k base/

# Aplicações
kubectl apply -k apps/

# Monitoring
kubectl apply -k monitoring/

# ArgoCD
kubectl apply -k argocd/

# Security
kubectl apply -k security/
```

### Deploy por ambiente
```bash
# Desenvolvimento
kubectl apply -k overlays/dev/

# Staging
kubectl apply -k overlays/staging/

# Produção
kubectl apply -k overlays/prod/
```

## 🔗 Acessos

### Port Forward
```bash
./scripts/port-forward.sh
```

| Serviço | Comando | URL |
|---------|---------|-----|
| Frontend | `kubectl port-forward svc/frontend 3000:3000 -n product-platform` | http://localhost:3000 |
| Product API | `kubectl port-forward svc/product-service 8080:8080 -n product-platform` | http://localhost:8080 |
| Grafana | `kubectl port-forward svc/grafana 3001:3000 -n monitoring` | http://localhost:3001 |
| Prometheus | `kubectl port-forward svc/prometheus 9090:9090 -n monitoring` | http://localhost:9090 |
| ArgoCD | `kubectl port-forward svc/argocd-server 8443:443 -n argocd` | https://localhost:8443 |
| Security Dashboard | `kubectl port-forward svc/security-dashboard 3002:3000 -n security` | http://localhost:3002 |
| OpenSearch | `kubectl port-forward svc/opensearch-proxy 9200:80 -n data` | http://localhost:9200/_dashboards |
| SonarQube | `kubectl port-forward svc/sonarqube 9000:9000 -n quality` | http://localhost:9000 |

### Credenciais

| Serviço | Usuário | Senha |
|---------|---------|-------|
| Grafana | admin | admin123 |
| ArgoCD | admin | `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" \| base64 -d` |
| Security Dashboard | admin | SecDash135246! |
| OpenSearch | admin | ProdCompPlat135246OpenSearch! |
| SonarQube | admin | admin (alterar no primeiro acesso) |

## 📊 Monitoramento

### Métricas disponíveis
- CPU/Memory usage por pod
- Request rate por serviço
- Error rate (4xx, 5xx)
- Latência de requests
- JVM metrics (heap, GC)
- Custom business metrics

### Alertas configurados
- High CPU/Memory usage
- Pod CrashLooping
- High error rate
- Database connection failure
- RabbitMQ down
- WAF blocked requests
- GuardDuty findings

## 🔐 Segurança

### Implementado
- **AWS WAF** - Proteção contra SQL Injection, XSS, Rate Limiting
- **AWS GuardDuty** - Detecção de ameaças
- **AWS Shield Standard** - Proteção DDoS
- **IRSA** - IAM Roles for Service Accounts
- **Network Policies** - Segmentação de rede
- **Secrets Management** - Credenciais em Kubernetes Secrets

### Dashboard de Segurança
Acesse o Security Dashboard para visualizar:
- WAF blocked requests
- GuardDuty threats
- DDoS attacks (Shield)
- Error rates
- Request patterns

## 🆘 Disaster Recovery

### Componentes monitorados
- RDS PostgreSQL
- Amazon MQ (RabbitMQ)
- ElastiCache (Redis)
- OpenSearch
- EKS Nodes

### Fluxo de recuperação
1. **Detecção**: Prometheus detecta falha
2. **Alerta**: Alertmanager notifica Slack/PagerDuty
3. **Trigger**: DR Controller recebe webhook
4. **Análise**: Verifica componente afetado
5. **Recuperação**: Trigger GitHub Actions para terraform apply
6. **Validação**: Health checks confirmam recuperação
7. **Notificação**: Time notificado do status

## 📝 Troubleshooting

### Ver status dos pods
```bash
./scripts/status.sh
```

### Ver logs de um pod
```bash
kubectl logs -f deployment/product-service -n product-platform
```

### Restart de um deployment
```bash
kubectl rollout restart deployment/product-service -n product-platform
```

### Verificar eventos
```bash
kubectl get events -n product-platform --sort-by='.lastTimestamp'
```

## 🔄 CI/CD

### ArgoCD Sync
Os deployments são gerenciados pelo ArgoCD com sync automático.
```bash
# Ver status das applications
kubectl get applications -n argocd

# Sync manual
argocd app sync product-service
```

### GitHub Actions
Workflows disponíveis:
- `ci-product-service.yml` - Build e push do product-service
- `ci-ai-service.yml` - Build e push do ai-service
- `ci-search-service.yml` - Build e push do search-service
- `ci-frontend.yml` - Build e push do frontend
- `disaster-recovery.yml` - Terraform apply para DR

## 📚 Referências

- [Kustomize Documentation](https://kustomize.io/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Operator](https://prometheus-operator.dev/)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)

---

**Maintainer**: Vini  
**Last Updated**: December 2024  
**Version**: 1.0.0
```

---

## 📊 **Arquitetura de Alertas**
```
┌─────────────────────────────────────────────────────────────────────┐
│                        ALERTING FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐     ┌─────────────────┐     ┌───────────────┐   │
│  │  Prometheus   │────▶│  Alertmanager   │────▶│    Slack      │   │
│  │  (Metrics)    │     │  (Routing)      │     │  #alerts-*    │   │
│  └───────────────┘     └────────┬────────┘     └───────────────┘   │
│                                 │                                   │
│  ┌───────────────┐              │              ┌───────────────┐   │
│  │  GuardDuty    │              ├─────────────▶│   Discord     │   │
│  │  (Security)   │──────────────┤              │  #alerts      │   │
│  └───────────────┘              │              └───────────────┘   │
│                                 │                                   │
│  ┌───────────────┐              │              ┌───────────────┐   │
│  │  WAF Metrics  │              ├─────────────▶│  PagerDuty    │   │
│  │  (Exporter)   │──────────────┤              │  (On-Call)    │   │
│  └───────────────┘              │              └───────────────┘   │
│                                 │                                   │
│  ┌───────────────┐              │              ┌───────────────┐   │
│  │  Shield       │              └─────────────▶│  DR Controller│   │
│  │  (DDoS)       │─────────────────────────────│  (Auto-fix)   │   │
│  └───────────────┘                             └───────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

---

## 📊 **RESUMO FINAL DA ESTRUTURA**
```
k8s/
├── README.md                    # Documentação completa
├── kustomization.yaml           # Kustomization raiz
│
├── base/                        # ✅ Recursos compartilhados
│   ├── namespaces/
│   ├── configmaps/
│   ├── secrets/
│   └── kustomization.yaml
│
├── apps/                        # ✅ Microserviços
│   ├── product-service/
│   ├── ai-service/
│   ├── search-service/
│   ├── frontend/
│   └── kustomization.yaml
│
├── monitoring/                  # ✅ Observabilidade
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   ├── promtail/
│   ├── alertmanager/
│   └── kustomization.yaml
│
├── quality/                     # ✅ Code Quality
│   ├── sonarqube/
│   └── kustomization.yaml
│
├── data/                        # ✅ Data Tools
│   ├── opensearch-proxy/
│   └── kustomization.yaml
│
├── argocd/                      # ✅ GitOps
│   ├── install/
│   ├── apps/
│   ├── projects/
│   ├── config/
│   └── kustomization.yaml
│
├── ingress/                     # ✅ Ingress/ALB
│   ├── alb-controller/
│   ├── ingress-apps.yaml
│   ├── ingress-monitoring.yaml
│   ├── ingress-quality.yaml
│   ├── ingress-argocd.yaml
│   └── kustomization.yaml
│
├── security/                    # ✅ Security & DR
│   ├── security-dashboard/
│   ├── alerting/
│   ├── disaster-recovery/
│   └── kustomization.yaml
│
├── overlays/                    # ✅ Environments
│   ├── dev/
│   ├── staging/
│   └── prod/
│
└── scripts/                     # ✅ Deploy Scripts
    ├── deploy-all.sh
    ├── deploy-apps.sh
    ├── deploy-monitoring.sh
    ├── deploy-argocd.sh
    ├── deploy-security.sh
    ├── deploy-quality.sh
    ├── deploy-data.sh
    ├── status.sh
    ├── port-forward.sh
    └── cleanup.sh