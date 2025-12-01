# 🚀 CI/CD Pipeline Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GITHUB ACTIONS (CI)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Build   │──▶│   Test   │──▶│   Scan   │──▶│  Docker  │──▶│   Push   │  │
│  │  Maven   │   │  JUnit   │   │  Trivy   │   │  Build   │   │   ECR    │  │
│  └──────────┘   │ SonarQube│   │ Checkov  │   └──────────┘   └──────────┘  │
│                 │ CodeQL   │   │ Semgrep  │                                 │
│                 └──────────┘   └──────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Update K8s manifests
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARGOCD (CD/GitOps)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Monitors Git repository for changes                                       │
│  • Auto-syncs K8s manifests to EKS cluster                                  │
│  • Provides rollback capability                                              │
│  • Sends notifications to Slack                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               EKS CLUSTER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ product-service │    │   ai-service    │    │    Rancher      │         │
│  │   (2 replicas)  │    │   (2 replicas)  │    │  (Management)   │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📁 Pipeline Files

```
.github/workflows/
├── ci-backend.yml       # CI for Java microservices
├── ci-terraform.yml     # CI/CD for Terraform
└── security-scan.yml    # DevSecOps security scanning

k8s/argocd/
├── apps/
│   ├── app-of-apps.yaml      # App of Apps pattern
│   ├── product-service.yaml  # Product Service app
│   └── ai-service.yaml       # AI Service app
├── config/
│   └── notifications.yaml    # Slack/GitHub notifications
└── projects/
    └── product-platform.yaml # ArgoCD project
```

## 🔑 Required GitHub Secrets

Configure these secrets in your GitHub repository:

### AWS Credentials
| Secret Name | Description |
|------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key for ECR push |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key |
| `AWS_ACCOUNT_ID` | AWS Account ID (e.g., `347277718217`) |

### Database Credentials
| Secret Name | Description |
|------------|-------------|
| `DB_PASSWORD` | PostgreSQL password |
| `RABBITMQ_PASSWORD` | RabbitMQ password |

### Code Quality (Optional)
| Secret Name | Description |
|------------|-------------|
| `SONAR_TOKEN` | SonarQube authentication token |
| `SONAR_HOST_URL` | SonarQube server URL |

### Security Scanning (Optional)
| Secret Name | Description |
|------------|-------------|
| `GITLEAKS_LICENSE` | Gitleaks license key |

## 🚀 Setup Instructions

### 1. Configure GitHub Secrets

```bash
# Using GitHub CLI
gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."
gh secret set AWS_SECRET_ACCESS_KEY --body "..."
gh secret set AWS_ACCOUNT_ID --body "347277718217"
gh secret set DB_PASSWORD --body "ProdCompPlat135246PostgreSQL"
gh secret set RABBITMQ_PASSWORD --body "ProdCompPlat135246RabbitMQ"
```

### 2. Install ArgoCD

```bash
chmod +x scripts/install-argocd.sh
./scripts/install-argocd.sh
```

### 3. Configure ArgoCD Repository

```bash
# Login to ArgoCD
argocd login <ARGOCD_URL> --username admin --password <PASSWORD> --insecure

# Add Git repository
argocd repo add https://github.com/YOUR_ORG/product-comparison-platform.git \
  --username <GITHUB_USER> \
  --password <GITHUB_TOKEN>
```

### 4. Deploy ArgoCD Applications

```bash
# Apply ArgoCD project
kubectl apply -f k8s/argocd/projects/product-platform.yaml

# Apply App of Apps (deploys all services)
kubectl apply -f k8s/argocd/apps/app-of-apps.yaml
```

### 5. Configure Notifications (Optional)

Update `k8s/argocd/config/notifications.yaml` with your Slack token:

```bash
kubectl apply -f k8s/argocd/config/notifications.yaml
```

## 📊 Pipeline Workflows

### CI - Backend Services (`ci-backend.yml`)

**Triggers:**
- Push to `main` or `develop` branch
- Changes in `backend/services/**`

**Jobs:**
1. **detect-changes** - Identify which services changed
2. **build-product-service** - Build and test product-service
3. **build-ai-service** - Build and test ai-service
4. **sonarqube** - Code quality analysis
5. **docker-build-push** - Build and push to ECR
6. **update-manifests** - Update K8s image tags

### CI/CD - Terraform (`ci-terraform.yml`)

**Triggers:**
- Push to `main` or `develop` branch
- Changes in `infrastructure/terraform/**`

**Jobs:**
1. **validate** - Format check and validate
2. **security-scan** - Checkov security scan
3. **tfsec-scan** - tfsec security scan
4. **plan** - Generate Terraform plan
5. **apply** - Apply changes (main branch only, requires approval)

### DevSecOps - Security Scan (`security-scan.yml`)

**Triggers:**
- Every push and PR
- Weekly schedule (Sunday midnight)
- Manual trigger

**Jobs:**
1. **dependency-check** - OWASP dependency vulnerabilities
2. **sast-codeql** - CodeQL static analysis
3. **sast-semgrep** - Semgrep security patterns
4. **secret-scan** - Gitleaks secret detection
5. **container-scan** - Trivy container vulnerabilities
6. **k8s-scan** - Kubesec K8s manifest security

## 🔄 GitOps Workflow

```
Developer                GitHub                  ArgoCD                  EKS
    │                       │                       │                     │
    │  Push code            │                       │                     │
    │──────────────────────▶│                       │                     │
    │                       │                       │                     │
    │                       │  CI Pipeline          │                     │
    │                       │  (Build, Test, Scan)  │                     │
    │                       │──────────┐            │                     │
    │                       │          │            │                     │
    │                       │◀─────────┘            │                     │
    │                       │                       │                     │
    │                       │  Push image to ECR    │                     │
    │                       │─────────────────────▶ │                     │
    │                       │                       │                     │
    │                       │  Update K8s manifests │                     │
    │                       │───────────┐           │                     │
    │                       │           │           │                     │
    │                       │◀──────────┘           │                     │
    │                       │                       │                     │
    │                       │  Detect changes       │                     │
    │                       │◀──────────────────────│                     │
    │                       │                       │                     │
    │                       │                       │  Sync to cluster    │
    │                       │                       │────────────────────▶│
    │                       │                       │                     │
    │                       │                       │  Notification       │
    │◀──────────────────────────────────────────────│                     │
    │                       │                       │                     │
```

## 🛡️ Security Features

### Static Analysis (SAST)
- **CodeQL**: GitHub's semantic code analysis
- **Semgrep**: Pattern-based security scanning
- **SonarQube**: Code quality and security

### Dependency Scanning
- **OWASP Dependency Check**: CVE database lookup
- **Trivy**: Container image vulnerabilities

### Infrastructure Security
- **Checkov**: Terraform misconfigurations
- **tfsec**: Terraform security scanner
- **Kubesec**: Kubernetes manifest security

### Secret Detection
- **Gitleaks**: Detect hardcoded secrets

## 🎯 Best Practices

### Branch Protection
```yaml
# Recommended branch protection rules
main:
  - Require pull request reviews (2)
  - Require status checks to pass
  - Require branches to be up to date
  - Include administrators
```

### Environment Protection
```yaml
# GitHub Environments
production:
  - Required reviewers: 2
  - Wait timer: 5 minutes
  - Deployment branches: main only
```

### Rollback Procedure

Using ArgoCD:
```bash
# List application history
argocd app history product-service

# Rollback to specific revision
argocd app rollback product-service <REVISION>

# Rollback to previous version
argocd app rollback product-service
```

Using kubectl:
```bash
# Rollback deployment
kubectl rollout undo deployment/product-service -n product-platform

# Rollback to specific revision
kubectl rollout undo deployment/product-service -n product-platform --to-revision=2
```

## 📈 Monitoring Deployments

### ArgoCD UI
Access at: `https://<ARGOCD_URL>`

### CLI Commands
```bash
# Check application status
argocd app get product-service

# View sync status
argocd app list

# View deployment logs
argocd app logs product-service

# Force sync
argocd app sync product-service --force
```

## 🔧 Troubleshooting

### Pipeline Failures

```bash
# Check GitHub Actions logs
gh run view <RUN_ID> --log

# Re-run failed jobs
gh run rerun <RUN_ID> --failed
```

### ArgoCD Issues

```bash
# Check ArgoCD logs
kubectl logs -n argocd deployment/argocd-server

# Check application events
argocd app get product-service --show-operation

# Hard refresh
argocd app get product-service --hard-refresh
```

### Image Pull Errors

```bash
# Verify ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 347277718217.dkr.ecr.us-east-1.amazonaws.com

# Check image exists
aws ecr describe-images --repository-name product-comparison-dev-product-service
```