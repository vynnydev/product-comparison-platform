#!/bin/bash
# rabbitmq-tunnel.sh - Acessa o console RabbitMQ via kubectl port-forward

set -e

# Configurações
NAMESPACE="rabbitmq-proxy"
POD_NAME="rabbitmq-proxy"
LOCAL_PORT="15672"
RABBITMQ_HOST="b-8b802f5f-83c6-4049-963d-220933e0a82b.mq.us-east-1.on.aws"
RABBITMQ_PORT="443"

echo "🐰 RabbitMQ Console Tunnel"
echo "=========================="
echo ""

# Verificar kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl não encontrado. Instale primeiro."
    exit 1
fi

# Verificar conexão com cluster
echo "📡 Verificando conexão com cluster EKS..."
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Não conectado ao cluster. Execute:"
    echo "   aws eks update-kubeconfig --region us-east-1 --name product-comparison-dev"
    exit 1
fi

# Criar namespace se não existir
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - 2>/dev/null

# Deletar pod antigo se existir
kubectl delete pod $POD_NAME -n $NAMESPACE --ignore-not-found=true 2>/dev/null

echo "🚀 Criando pod proxy..."

# Criar pod que faz proxy para RabbitMQ
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: $POD_NAME
  namespace: $NAMESPACE
  labels:
    app: rabbitmq-proxy
spec:
  containers:
  - name: socat
    image: alpine/socat:latest
    args:
      - "TCP-LISTEN:15672,fork,reuseaddr"
      - "TCP:${RABBITMQ_HOST}:${RABBITMQ_PORT}"
    ports:
    - containerPort: 15672
      name: rabbitmq-console
  restartPolicy: Never
EOF

# Esperar pod ficar ready
echo "⏳ Aguardando pod ficar pronto..."
kubectl wait --for=condition=Ready pod/$POD_NAME -n $NAMESPACE --timeout=60s

echo ""
echo "✅ Pod proxy criado!"
echo ""
echo "🔗 Iniciando port-forward..."
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Acesse o RabbitMQ Console em:"
echo ""
echo "  🌐 https://localhost:${LOCAL_PORT}"
echo ""
echo "  👤 Usuário: admin"
echo "  🔐 Senha: (sua senha configurada no Terraform)"
echo ""
echo "  ⚠️  Aceite o certificado SSL autoassinado no navegador"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Pressione Ctrl+C para encerrar o túnel"
echo ""

# Port forward
kubectl port-forward pod/$POD_NAME $LOCAL_PORT:15672 -n $NAMESPACE