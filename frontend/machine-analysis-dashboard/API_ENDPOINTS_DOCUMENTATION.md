# Cognitiva Analytics - Documentação de Endpoints para Backend (AWS Lambda)

## Visão Geral
Este documento lista todos os endpoints e funcionalidades que precisam ser implementados no backend AWS Lambda para o sistema Cognitiva Analytics.

---

## 1. AUTENTICAÇÃO E USUÁRIOS

### 1.1 Registro de Usuário
**Endpoint:** `POST /auth/register`

**Request Body:**
\`\`\`json
{
  "name": "string",
  "email": "string",
  "username": "string",
  "location_id": "string",
  "password": "string"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Usuário registrado com sucesso",
  "user_id": "string (UUID)",
  "username": "string",
  "email": "string",
  "email_verification_required": boolean
}
\`\`\`

**Erros:**
- 400: Dados inválidos
- 409: Usuário já existe

---

### 1.2 Login de Usuário
**Endpoint:** `POST /auth/login`

**Request Body:**
\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login realizado com sucesso",
  "access_token": "string (JWT)",
  "id_token": "string (JWT)",
  "refresh_token": "string",
  "expires_in": number,
  "user": {
    "user_id": "string (UUID)",
    "username": "string",
    "email": "string",
    "name": "string",
    "location_id": "string",
    "email_verified": boolean
  }
}
\`\`\`

**Erros:**
- 401: Credenciais inválidas
- 404: Usuário não encontrado

---

### 1.3 Refresh Token
**Endpoint:** `POST /auth/refresh`

**Request Body:**
\`\`\`json
{
  "refresh_token": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "access_token": "string (JWT)",
  "id_token": "string (JWT)",
  "expires_in": number
}
\`\`\`

---

### 1.4 Logout
**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "message": "Logout realizado com sucesso"
}
\`\`\`

---

### 1.5 Obter Perfil do Usuário
**Endpoint:** `GET /auth/profile`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "user_id": "string",
  "username": "string",
  "name": "string",
  "email": "string",
  "location_id": "string",
  "email_verified": boolean,
  "created_at": "ISO date",
  "last_login": "ISO date"
}
\`\`\`

---

## 2. MÁQUINAS / EQUIPAMENTOS

### 2.1 Listar Todas as Máquinas do Usuário
**Endpoint:** `GET /machines`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `status` (opcional): operational, warning, critical, maintenance
- `location` (opcional): string
- `type` (opcional): centrifugal-pump, compressor, electric-motor, etc.
- `page` (opcional): number
- `limit` (opcional): number

**Response (200):**
\`\`\`json
{
  "machines": [
    {
      "machine_id": "string",
      "machine_name": "string",
      "model": "string",
      "type": "string",
      "manufacturer": "string",
      "status": "operational|warning|critical|maintenance",
      "location": "string",
      "last_maintenance": "ISO date",
      "next_maintenance": "ISO date",
      "efficiency": number,
      "metrics": {
        "temperature": number,
        "temperature_status": "normal|warning|critical",
        "vibration": number,
        "vibration_status": "normal|warning|critical",
        "pressure": number,
        "pressure_status": "normal|warning|critical",
        "runtime": number,
        "runtime_hours": number
      }
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
\`\`\`

---

### 2.2 Obter Máquina por ID
**Endpoint:** `GET /machines/{machine_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "machine_id": "string",
  "machine_name": "string",
  "model": "string",
  "type": "string",
  "manufacturer": "string",
  "serial_number": "string",
  "installation_date": "ISO date",
  "status": "string",
  "location": "string",
  "last_maintenance": "ISO date",
  "next_maintenance": "ISO date",
  "efficiency": number,
  "metrics": { ... },
  "parts": [
    {
      "part_id": "string",
      "name": "string",
      "part_number": "string",
      "manufacturer": "string",
      "status": "good|warning|critical",
      "recommendation": "string",
      "metrics": { ... }
    }
  ]
}
\`\`\`

---

### 2.3 Criar Nova Máquina
**Endpoint:** `POST /machines`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "machine_name": "string",
  "model": "string",
  "type": "string",
  "manufacturer": "string",
  "serial_number": "string",
  "location": "string",
  "installation_date": "ISO date"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Máquina criada com sucesso",
  "machine_id": "string",
  "machine": { ... }
}
\`\`\`

---

### 2.4 Atualizar Máquina
**Endpoint:** `PUT /machines/{machine_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:** (campos opcionais)
\`\`\`json
{
  "machine_name": "string",
  "location": "string",
  "status": "string",
  "next_maintenance": "ISO date"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Máquina atualizada com sucesso",
  "machine": { ... }
}
\`\`\`

---

### 2.5 Deletar Máquina
**Endpoint:** `DELETE /machines/{machine_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "message": "Máquina deletada com sucesso"
}
\`\`\`

---

### 2.6 Máquinas Ativas em Tempo Real
**Endpoint:** `GET /machines/active`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "active_machines": [
    {
      "machine_id": "string",
      "machine_name": "string",
      "status": "running|idle",
      "current_task": "string",
      "speed": number,
      "efficiency": number,
      "temperature": number,
      "location": "string",
      "start_time": "ISO datetime"
    }
  ]
}
\`\`\`

---

## 3. TAREFAS DE MANUTENÇÃO (KANBAN)

### 3.1 Listar Tarefas
**Endpoint:** `GET /tasks`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `status` (opcional): todo, in-progress, review, done
- `machine_id` (opcional): string
- `priority` (opcional): low, medium, high, urgent

**Response (200):**
\`\`\`json
{
  "tasks": [
    {
      "task_id": "string",
      "title": "string",
      "description": "string",
      "status": "todo|in-progress|review|done",
      "priority": "low|medium|high|urgent",
      "machine_id": "string",
      "machine_name": "string",
      "assigned_to": ["user_id1", "user_id2"],
      "tags": ["string"],
      "progress": number,
      "due_date": "ISO date",
      "created_at": "ISO datetime",
      "updated_at": "ISO datetime"
    }
  ]
}
\`\`\`

---

### 3.2 Criar Tarefa
**Endpoint:** `POST /tasks`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "title": "string",
  "description": "string",
  "machine_id": "string",
  "priority": "low|medium|high|urgent",
  "assigned_to": ["user_id"],
  "tags": ["string"],
  "due_date": "ISO date"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Tarefa criada com sucesso",
  "task_id": "string",
  "task": { ... }
}
\`\`\`

---

### 3.3 Atualizar Tarefa
**Endpoint:** `PUT /tasks/{task_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:** (campos opcionais)
\`\`\`json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "progress": number,
  "priority": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Tarefa atualizada com sucesso",
  "task": { ... }
}
\`\`\`

---

### 3.4 Deletar Tarefa
**Endpoint:** `DELETE /tasks/{task_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "message": "Tarefa deletada com sucesso"
}
\`\`\`

---

### 3.5 Mover Tarefa entre Colunas
**Endpoint:** `PATCH /tasks/{task_id}/move`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "new_status": "todo|in-progress|review|done"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Tarefa movida com sucesso",
  "task": { ... }
}
\`\`\`

---

## 4. DIAGNÓSTICOS E ANÁLISES

### 4.1 Obter Diagnóstico Mensal
**Endpoint:** `GET /diagnostics/monthly`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `year`: number
- `month`: number

**Response (200):**
\`\`\`json
{
  "month": "string",
  "year": number,
  "total_maintenances": number,
  "preventive_maintenances": number,
  "corrective_maintenances": number,
  "issues_detected": number,
  "average_downtime": number,
  "machines_with_issues": [
    {
      "machine_id": "string",
      "machine_name": "string",
      "issue_count": number,
      "last_issue_date": "ISO date"
    }
  ]
}
\`\`\`

---

### 4.2 Listar Problemas/Issues
**Endpoint:** `GET /diagnostics/issues`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `severity` (opcional): baixa, média, alta, crítica
- `status` (opcional): aberto, em-progresso, resolvido
- `machine_id` (opcional): string

**Response (200):**
\`\`\`json
{
  "issues": [
    {
      "issue_id": "string",
      "machine_id": "string",
      "machine_name": "string",
      "title": "string",
      "description": "string",
      "severity": "baixa|média|alta|crítica",
      "status": "aberto|em-progresso|resolvido",
      "detected_at": "ISO datetime",
      "resolved_at": "ISO datetime",
      "assigned_to": "user_id"
    }
  ]
}
\`\`\`

---

### 4.3 Criar Issue
**Endpoint:** `POST /diagnostics/issues`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "machine_id": "string",
  "title": "string",
  "description": "string",
  "severity": "baixa|média|alta|crítica"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Issue criado com sucesso",
  "issue_id": "string",
  "issue": { ... }
}
\`\`\`

---

### 4.4 Calendário de Atividades
**Endpoint:** `GET /diagnostics/calendar`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `start_date`: ISO date
- `end_date`: ISO date

**Response (200):**
\`\`\`json
{
  "activities": [
    {
      "date": "ISO date",
      "maintenances_count": number,
      "issues_count": number,
      "tasks_completed": number,
      "events": [
        {
          "type": "maintenance|issue|task",
          "machine_name": "string",
          "description": "string",
          "status": "string"
        }
      ]
    }
  ]
}
\`\`\`

---

## 5. FATURAMENTO E PAGAMENTOS

### 5.1 Obter Resumo Financeiro
**Endpoint:** `GET /billing/summary`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `start_date` (opcional): ISO date
- `end_date` (opcional): ISO date

**Response (200):**
\`\`\`json
{
  "balance": number,
  "total_expenses": number,
  "expenses_by_category": {
    "maintenance_parts": number,
    "labor": number,
    "ai_tools": number,
    "energy": number
  },
  "monthly_trend": [
    {
      "month": "string",
      "amount": number
    }
  ]
}
\`\`\`

---

### 5.2 Listar Transações
**Endpoint:** `GET /billing/transactions`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `type` (opcional): income, expense
- `status` (opcional): success, pending, canceled
- `page` (opcional): number
- `limit` (opcional): number

**Response (200):**
\`\`\`json
{
  "transactions": [
    {
      "transaction_id": "string",
      "type": "income|expense",
      "amount": number,
      "category": "string",
      "description": "string",
      "status": "success|pending|canceled",
      "payment_method": "credit_card|wire_transfer",
      "date": "ISO datetime",
      "machine_id": "string",
      "machine_name": "string"
    }
  ],
  "total": number
}
\`\`\`

---

### 5.3 Criar Transação
**Endpoint:** `POST /billing/transactions`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "type": "income|expense",
  "amount": number,
  "category": "string",
  "description": "string",
  "payment_method": "string",
  "machine_id": "string"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Transação criada com sucesso",
  "transaction_id": "string",
  "transaction": { ... }
}
\`\`\`

---

### 5.4 Listar Cartões Salvos
**Endpoint:** `GET /billing/cards`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "cards": [
    {
      "card_id": "string",
      "card_holder": "string",
      "card_number_last4": "string",
      "brand": "mastercard|visa|amex",
      "expiry_month": number,
      "expiry_year": number,
      "is_default": boolean
    }
  ]
}
\`\`\`

---

### 5.5 Adicionar Cartão
**Endpoint:** `POST /billing/cards`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "card_holder": "string",
  "card_number": "string",
  "expiry_month": number,
  "expiry_year": number,
  "cvv": "string",
  "set_as_default": boolean
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Cartão adicionado com sucesso",
  "card_id": "string"
}
\`\`\`

---

### 5.6 Deletar Cartão
**Endpoint:** `DELETE /billing/cards/{card_id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "message": "Cartão removido com sucesso"
}
\`\`\`

---

## 6. MONITORAMENTO EM TEMPO REAL

### 6.1 Status de Produção
**Endpoint:** `GET /monitoring/production-status`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "production_lines": [
    {
      "line_id": "string",
      "line_name": "string",
      "status": "active|idle|maintenance",
      "machines": [
        {
          "machine_id": "string",
          "machine_name": "string",
          "process": "packing|labeling|riveting|cutting",
          "status": "running|idle"
        }
      ],
      "efficiency": number,
      "units_produced_today": number
    }
  ]
}
\`\`\`

---

### 6.2 Métricas em Tempo Real
**Endpoint:** `GET /monitoring/realtime-metrics`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `machine_id`: string

**Response (200):**
\`\`\`json
{
  "machine_id": "string",
  "timestamp": "ISO datetime",
  "metrics": {
    "temperature": number,
    "vibration": number,
    "pressure": number,
    "rpm": number,
    "power_consumption": number
  },
  "alerts": [
    {
      "type": "warning|critical",
      "message": "string",
      "metric": "string"
    }
  ]
}
\`\`\`

---

## 7. INVENTÁRIO

### 7.1 Listar Peças do Inventário
**Endpoint:** `GET /inventory/parts`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `machine_id` (opcional): string
- `status` (opcional): in-stock, low-stock, out-of-stock
- `search` (opcional): string

**Response (200):**
\`\`\`json
{
  "parts": [
    {
      "part_id": "string",
      "part_name": "string",
      "part_number": "string",
      "manufacturer": "string",
      "quantity": number,
      "min_quantity": number,
      "unit_price": number,
      "location": "string",
      "compatible_machines": ["machine_id"],
      "status": "in-stock|low-stock|out-of-stock"
    }
  ]
}
\`\`\`

---

### 7.2 Adicionar Peça ao Inventário
**Endpoint:** `POST /inventory/parts`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "part_name": "string",
  "part_number": "string",
  "manufacturer": "string",
  "quantity": number,
  "min_quantity": number,
  "unit_price": number,
  "compatible_machines": ["machine_id"]
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "message": "Peça adicionada ao inventário",
  "part_id": "string"
}
\`\`\`

---

## 8. RELATÓRIOS

### 8.1 Gerar Relatório de Manutenção
**Endpoint:** `GET /reports/maintenance`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `start_date`: ISO date
- `end_date`: ISO date
- `format` (opcional): json, pdf, csv

**Response (200):**
\`\`\`json
{
  "report_id": "string",
  "period": {
    "start_date": "ISO date",
    "end_date": "ISO date"
  },
  "total_maintenances": number,
  "preventive": number,
  "corrective": number,
  "average_downtime_hours": number,
  "total_cost": number,
  "machines_serviced": number,
  "detailed_maintenances": [...]
}
\`\`\`

---

### 8.2 Gerar Relatório de Eficiência
**Endpoint:** `GET /reports/efficiency`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `start_date`: ISO date
- `end_date`: ISO date

**Response (200):**
\`\`\`json
{
  "report_id": "string",
  "average_efficiency": number,
  "machines": [
    {
      "machine_id": "string",
      "machine_name": "string",
      "efficiency": number,
      "uptime_hours": number,
      "downtime_hours": number,
      "units_produced": number
    }
  ]
}
\`\`\`

---

## 9. NOTIFICAÇÕES

### 9.1 Listar Notificações
**Endpoint:** `GET /notifications`

**Headers:** `Authorization: Bearer {access_token}`

**Query Params:**
- `unread_only` (opcional): boolean

**Response (200):**
\`\`\`json
{
  "notifications": [
    {
      "notification_id": "string",
      "type": "alert|maintenance|task|info",
      "title": "string",
      "message": "string",
      "severity": "low|medium|high",
      "read": boolean,
      "created_at": "ISO datetime",
      "related_entity": {
        "type": "machine|task|issue",
        "id": "string"
      }
    }
  ]
}
\`\`\`

---

### 9.2 Marcar Notificação como Lida
**Endpoint:** `PATCH /notifications/{notification_id}/read`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
\`\`\`json
{
  "message": "Notificação marcada como lida"
}
\`\`\`

---

## 10. ANÁLISE PREDITIVA (IA)

### 10.1 Prever Falhas
**Endpoint:** `POST /ai/predict-failures`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "machine_id": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "machine_id": "string",
  "prediction": {
    "failure_probability": number,
    "predicted_failure_date": "ISO date",
    "confidence": number,
    "risk_factors": [
      {
        "factor": "string",
        "severity": "low|medium|high",
        "description": "string"
      }
    ],
    "recommendations": ["string"]
  }
}
\`\`\`

---

### 10.2 Otimizar Agenda de Manutenção
**Endpoint:** `POST /ai/optimize-schedule`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
\`\`\`json
{
  "time_window_days": number
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "optimized_schedule": [
    {
      "machine_id": "string",
      "machine_name": "string",
      "recommended_date": "ISO date",
      "priority": "low|medium|high|urgent",
      "estimated_duration_hours": number,
      "reason": "string"
    }
  ],
  "estimated_cost_savings": number
}
\`\`\`

---

## NOTAS DE IMPLEMENTAÇÃO

### Autenticação
- Todos os endpoints (exceto `/auth/register` e `/auth/login`) requerem token JWT
- Tokens devem ser passados no header: `Authorization: Bearer {token}`
- Implementar refresh token para renovação automática

### Segurança
- Validar todos os inputs
- Implementar rate limiting
- Sanitizar dados antes de salvar no banco
- Usar HTTPS em produção
- Implementar CORS adequadamente

### Banco de Dados
Sugestão de tabelas principais:
- `users`
- `machines`
- `machine_parts`
- `tasks`
- `issues`
- `transactions`
- `payment_methods`
- `maintenance_records`
- `notifications`
- `inventory_parts`

### WebSocket (Opcional)
Para monitoramento em tempo real, considerar implementar WebSocket:
- `wss://api.example.com/realtime`
- Enviar atualizações de métricas a cada 5-10 segundos

---

## PRIORIDADES DE IMPLEMENTAÇÃO

### Fase 1 (Essencial):
1. Autenticação (login, registro, refresh token)
2. Máquinas (CRUD básico)
3. Tarefas (Kanban board)
4. Diagnósticos (issues e problemas)

### Fase 2 (Importante):
5. Monitoramento em tempo real
6. Faturamento e transações
7. Inventário de peças
8. Notificações

### Fase 3 (Avançado):
9. Análise preditiva com IA
10. Relatórios avançados
11. WebSocket para tempo real
12. Integração com ferramentas externas

---

**Última Atualização:** 2025-11-12
**Versão da API:** 1.0.0
