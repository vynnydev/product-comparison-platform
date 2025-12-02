# 🚀 Product Comparison Platform - CI/CD & DevSecOps Guide

## 📋 Overview

Este documento descreve a estratégia de CI/CD e DevSecOps implementada no projeto.

## 🏗️ Arquitetura dos Pipelines

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions Workflows                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ CI - Product     │  │ CI - AI Service  │  │ CI - Terraform   │  │
│  │ Service          │  │                  │  │                  │  │
│  │                  │  │                  │  │                  │  │
│  │ • Build & Test   │  │ • Build & Test   │  │ • Validate       │  │
│  │ • OWASP Check    │  │ • OWASP Check    │  │ • Checkov        │  │
│  │ • SonarQube      │  │ • SonarQube      │  │ • tfsec          │  │
│  │ • Docker Push    │  │ • Docker Push    │  │ • Plan/Apply     │  │
│  │ • Trivy Scan     │  │ • Trivy Scan     │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 DevSecOps - Security Scan                     │  │
│  │                                                               │  │
│  │  • OWASP Dependency Check    • Gitleaks (Secrets)            │  │
│  │  • CodeQL SAST               • Kubesec (K8s)                 │  │
│  │  • Semgrep SAST              • Checkov + tfsec (Terraform)   │  │
│  │  • Trivy (Containers)        • Hadolint (Dockerfiles)        │  │
│  │                                                               │  │
│  │  🕐 Runs: Weekly (Sunday) + Push to main + Manual            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 Infrastructure Management                     │  │
│  │                                                               │  │
│  │  terraform-bootstrap.yml  → Create S3/DynamoDB backend       │  │
│  │  terraform-apply.yml      → Create/Update infrastructure     │  │
│  │  terraform-destroy.yml    → Destroy infrastructure           │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Workflows Directory Structure

```
.github/workflows/
├── ci-product-service.yml    # CI for Product Service
├── ci-ai-service.yml         # CI for AI Service
├── ci-terraform.yml          # CI for Terraform
├── security-scan.yml         # Full DevSecOps scan
├── terraform-bootstrap.yml   # Create backend (S3/DynamoDB)
├── terraform-apply.yml       # Apply infrastructure
└── terraform-destroy.yml     # Destroy infrastructure
```

## 🔐 Security Scanning Strategy

### Shift-Left Security

A segurança é integrada em todas as etapas do pipeline:

| Stage | Tools | Purpose |
|-------|-------|---------|
| Code | CodeQL, Semgrep | Static Application Security Testing (SAST) |
| Dependencies | OWASP Dependency Check | Known vulnerability detection |
| Secrets | Gitleaks | Prevent credential leaks |
| Containers | Trivy, Hadolint | Container image scanning |
| Kubernetes | Kubesec, Trivy Config | Manifest security |
| Terraform | Checkov, tfsec | Infrastructure as Code security |

### Scan Triggers

| Workflow | Push | PR | Schedule | Manual |
|----------|------|-----|----------|--------|
| CI - Product Service | ✅ | ✅ | ❌ | ❌ |
| CI - AI Service | ✅ | ✅ | ❌ | ❌ |
| CI - Terraform | ✅ | ✅ | ❌ | ✅ |
| Security Scan | ✅ | ✅ | Weekly | ✅ |

## 🚀 Microservices CI Pipeline

### Product Service (`ci-product-service.yml`)

```yaml
Triggers:
  - Push to main/development/improvement
  - PR to main/development/improvement
  - Path: backend/services/product-service/**

Jobs:
  1. build-and-test
     ├── PostgreSQL service container
     ├── RabbitMQ service container
     ├── Maven build & test
     └── Generate test report

  2. dependency-check
     └── OWASP vulnerability scan

  3. sonarqube
     └── Code quality analysis

  4. docker-build-push (main only)
     ├── Build Docker image
     ├── Trivy vulnerability scan
     └── Push to ECR
```

### AI Service (`ci-ai-service.yml`)

```yaml
Triggers:
  - Push to main/development/improvement
  - PR to main/development/improvement
  - Path: backend/services/ai-service/**

Jobs:
  1. build-and-test
     ├── Maven build & test
     └── Generate test report

  2. dependency-check
     └── OWASP vulnerability scan

  3. sonarqube
     └── Code quality analysis

  4. docker-build-push (main only)
     ├── Build Docker image
     ├── Trivy vulnerability scan
     └── Push to ECR
```

## 🏗️ Terraform CI Pipeline

### `ci-terraform.yml`

```yaml
Triggers:
  - Push to main/development/improvement
  - PR to main/development/improvement
  - Path: infrastructure/terraform/**
  - Manual (workflow_dispatch)

Jobs:
  1. validate
     ├── terraform fmt -check
     └── terraform validate

  2. security-checkov
     └── Checkov security scan

  3. security-tfsec
     └── tfsec security scan

  4. plan
     ├── terraform plan
     └── Comment on PR

  5. apply (main only)
     └── terraform apply
```

## 🔒 DevSecOps Full Scan

### `security-scan.yml`

```yaml
Triggers:
  - Push to main/develop
  - PR to main/develop
  - Weekly (Sunday 00:00 UTC)
  - Manual (workflow_dispatch)

Jobs:
  1. dependency-check (matrix)
     └── OWASP for each service

  2. sast-codeql
     └── CodeQL analysis

  3. sast-semgrep
     └── Semgrep rules

  4. secret-scan
     └── Gitleaks

  5. container-scan (matrix)
     └── Trivy for each image

  6. k8s-scan (matrix)
     └── Kubesec + Trivy config

  7. terraform-scan
     ├── Checkov
     └── tfsec

  8. dockerfile-lint
     └── Hadolint

  9. security-summary
     └── Generate report
```

## 🛠️ Infrastructure Management

### First Time Setup

```bash
# 1. Create backend (S3 + DynamoDB)
GitHub Actions → terraform-bootstrap.yml → apply

# 2. Create infrastructure
GitHub Actions → terraform-apply.yml → apply
```

### Destroy to Save Costs

```bash
# Destroy everything (keeps backend)
GitHub Actions → terraform-destroy.yml
  → confirm_destroy: DESTROY
  → environment: dev
  → destroy_k8s_first: true

# Estimated savings: ~$220/month
```

### Recreate

```bash
# Recreate from existing state
GitHub Actions → terraform-apply.yml → apply

# Time: ~15-20 minutes
```

## 📊 GitHub Security Tab

All SARIF reports are uploaded to GitHub Security:

- **CodeQL findings** → Code scanning alerts
- **Trivy findings** → Container vulnerabilities
- **Checkov findings** → IaC misconfigurations
- **tfsec findings** → Terraform security issues

Access: Repository → Security → Code scanning alerts

## 🔧 Required Secrets

| Secret | Description | Required For |
|--------|-------------|--------------|
| `AWS_ACCESS_KEY_ID` | AWS credentials | All |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials | All |
| `AWS_ACCOUNT_ID` | AWS account ID | ECR push |
| `DB_PASSWORD` | RDS password | Terraform |
| `RABBITMQ_PASSWORD` | RabbitMQ password | Terraform |
| `SONAR_TOKEN` | SonarQube token | Optional |
| `SONAR_HOST_URL` | SonarQube URL | Optional |
| `SEMGREP_APP_TOKEN` | Semgrep token | Optional |
| `GITLEAKS_LICENSE` | Gitleaks license | Optional |

## 📈 Best Practices Implemented

### ✅ CI/CD
- Separate pipelines per microservice
- Path-based triggers (only run when needed)
- Artifact caching (Maven, Docker layers)
- Parallel job execution
- PR comments with plan output

### ✅ Security
- Shift-left security testing
- Multiple scanner coverage
- SARIF integration with GitHub
- Soft-fail mode (doesn't block pipeline)
- Weekly comprehensive scans

### ✅ Infrastructure
- Immutable infrastructure
- State stored in S3 with locking
- Destroy/recreate capability
- Environment separation

## 🎯 Mercado Livre Assessment Highlights

This setup demonstrates:

1. **DevSecOps Culture** - Security integrated into every stage
2. **GitOps** - Infrastructure as Code with automated deployments
3. **Observability** - Test reports, security reports, pipeline summaries
4. **Cost Optimization** - Destroy/recreate capability saves ~$220/month
5. **Best Practices** - Industry-standard tools (Trivy, Checkov, CodeQL)

---

📅 Last updated: December 2025