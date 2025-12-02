# API Specification - Cognitiva Analytics
## Documentação Completa do Frontend e Estruturas JSON

Este documento descreve todas as funcionalidades do frontend, estruturas de dados JSON esperadas e endpoints de API necessários para o backend.

---

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Dashboard Principal](#dashboard-principal)
3. [Tarefas](#tarefas)
4. [Análise de Máquinas](#análise-de-máquinas)
5. [Monitoramento](#monitoramento)
6. [Oficina Virtual](#oficina-virtual)
7. [Transporte & Reboque](#transporte--reboque)
8. [Automatizar Fluxos](#automatizar-fluxos)
9. [Inventário](#inventário)
10. [Diagnósticos](#diagnósticos)
11. [Relatórios](#relatórios)
12. [Equipe & Usuários](#equipe--usuários)
13. [Faturamento/Planos](#faturamentoplanos)
14. [Configurações](#configurações)
15. [Assistente de IA](#assistente-de-ia)

---

## 🔐 Autenticação

### Páginas
- `/login` - Login de usuários
- `/signup` - Cadastro de novos usuários
- `/forgot-password` - Recuperação de senha

### Estruturas JSON

#### Usuário
\`\`\`json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "company": "string",
  "phone": "string",
  "job_title": "string",
  "department": "string",
  "role": "master | admin | manager | technician | operator | viewer",
  "avatar_url": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "plan": {
    "type": "starter | professional | enterprise",
    "status": "active | cancelled | expired",
    "billing_cycle": "monthly | annual",
    "next_billing_date": "date",
    "price": "number",
    "features": {
      "max_machines": "number",
      "max_locations": "number",
      "max_users": "number",
      "ai_analysis": "boolean",
      "advanced_reports": "boolean",
      "priority_support": "boolean",
      "team_management": "boolean"
    }
  },
  "permissions": {
    "can_view_dashboard": "boolean",
    "can_manage_machines": "boolean",
    "can_create_tasks": "boolean",
    "can_manage_team": "boolean",
    "can_view_reports": "boolean",
    "can_manage_billing": "boolean",
    "can_manage_users": "boolean"
  }
}
\`\`\`

#### User Roles (novos detalhes)
\`\`\`json
{
  "roles": [
    {
      "id": "master",
      "name": "Master/Owner",
      "description": "Controle total do sistema e gerenciamento de usuários",
      "permissions": ["all"]
    },
    {
      "id": "admin",
      "name": "Administrador",
      "description": "Gerenciamento completo exceto configurações de faturamento",
      "permissions": [
        "view_all_data",
        "manage_machines",
        "manage_tasks",
        "manage_team",
        "view_reports",
        "manage_locations"
      ]
    },
    {
      "id": "manager",
      "name": "Gerente",
      "description": "Gerenciamento de equipe e operações",
      "permissions": [
        "view_team_data",
        "manage_tasks",
        "view_machines",
        "create_reports",
        "manage_team_members"
      ]
    },
    {
      "id": "technician",
      "name": "Técnico",
      "description": "Execução de tarefas técnicas e manutenções",
      "permissions": [
        "view_assigned_tasks",
        "update_tasks",
        "view_machines",
        "create_diagnostics"
      ]
    },
    {
      "id": "operator",
      "name": "Operador",
      "description": "Operação básica e monitoramento",
      "permissions": [
        "view_machines",
        "view_tasks",
        "update_assigned_tasks"
      ]
    },
    {
      "id": "viewer",
      "name": "Visualizador",
      "description": "Apenas visualização de dados",
      "permissions": [
        "view_dashboard",
        "view_reports"
      ]
    }
  ]
}
\`\`\`

### Endpoints
\`\`\`
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
\`\`\`

---

## 🏠 Dashboard Principal

### Página
- `/dashboard` - Visão geral com métricas e gráficos

### Estruturas JSON

#### Dashboard Metrics
\`\`\`json
{
  "summary": {
    "total_machines": "number",
    "active_machines": "number",
    "machines_with_issues": "number",
    "pending_tasks": "number",
    "completed_tasks_today": "number",
    "maintenance_scheduled": "number",
    "efficiency_rate": "number (0-100)",
    "downtime_hours": "number"
  },
  "recent_alerts": [
    {
      "id": "uuid",
      "machine_id": "uuid",
      "machine_name": "string",
      "type": "critical | warning | info",
      "message": "string",
      "timestamp": "timestamp",
      "resolved": "boolean"
    }
  ],
  "charts": {
    "machine_status": {
      "operational": "number",
      "maintenance": "number",
      "offline": "number",
      "critical": "number"
    },
    "efficiency_trend": [
      {
        "date": "date",
        "value": "number"
      }
    ],
    "maintenance_schedule": [
      {
        "date": "date",
        "count": "number"
      }
    ]
  }
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/dashboard/metrics
GET    /api/dashboard/alerts
GET    /api/dashboard/charts
\`\`\`

---

## ✅ Tarefas

### Página
- `/dashboard/tasks` - Gerenciamento de tarefas de manutenção

### Estruturas JSON

#### Task
\`\`\`json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending | in_progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "type": "maintenance | inspection | repair | installation",
  "assigned_to": {
    "id": "uuid",
    "name": "string",
    "avatar_url": "string"
  },
  "machine": {
    "id": "uuid",
    "name": "string",
    "model": "string",
    "location_id": "uuid"
  },
  "location": {
    "id": "uuid",
    "name": "string",
    "address": "string"
  },
  "due_date": "timestamp",
  "estimated_duration": "number (minutes)",
  "actual_duration": "number (minutes)",
  "parts_needed": [
    {
      "part_id": "uuid",
      "part_name": "string",
      "quantity": "number",
      "status": "available | ordered | unavailable"
    }
  ],
  "attachments": [
    {
      "id": "uuid",
      "name": "string",
      "url": "string",
      "type": "image | pdf | video"
    }
  ],
  "notes": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "completed_at": "timestamp"
}
\`\`\`

#### Task Filters
\`\`\`json
{
  "status": ["pending", "in_progress"],
  "priority": ["high", "urgent"],
  "assigned_to": "uuid",
  "location_id": "uuid",
  "machine_id": "uuid",
  "date_from": "date",
  "date_to": "date"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/tasks?status=&priority=&location_id=&machine_id=
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status
POST   /api/tasks/:id/assign
POST   /api/tasks/:id/attachments
\`\`\`

---

## 🔍 Análise de Máquinas

### Página
- `/dashboard/analysis` - Análise detalhada com visualização 3D

### Estruturas JSON

#### Machine Analysis
\`\`\`json
{
  "machine": {
    "id": "uuid",
    "name": "string",
    "model": "string",
    "type": "pump | motor | compressor | cnc | turbine",
    "serial_number": "string",
    "manufacturer": "string",
    "installation_date": "date",
    "location": {
      "id": "uuid",
      "name": "string",
      "address": "string",
      "coordinates": {
        "lat": "number",
        "lng": "number"
      }
    },
    "status": "operational | maintenance | offline | critical",
    "image_url": "string",
    "model_3d_url": "string"
  },
  "realtime_metrics": {
    "temperature": {
      "value": "number",
      "unit": "°C",
      "status": "normal | warning | critical",
      "min": "number",
      "max": "number"
    },
    "vibration": {
      "value": "number",
      "unit": "mm/s",
      "status": "normal | warning | critical",
      "min": "number",
      "max": "number"
    },
    "pressure": {
      "value": "number",
      "unit": "bar",
      "status": "normal | warning | critical",
      "min": "number",
      "max": "number"
    },
    "rpm": {
      "value": "number",
      "unit": "RPM",
      "status": "normal | warning | critical",
      "min": "number",
      "max": "number"
    },
    "power_consumption": {
      "value": "number",
      "unit": "kW",
      "status": "normal | warning | critical"
    },
    "efficiency": {
      "value": "number",
      "unit": "%"
    }
  },
  "components": [
    {
      "id": "uuid",
      "name": "string",
      "type": "bearing | motor | shaft | seal | valve",
      "status": "normal | warning | critical",
      "health_score": "number (0-100)",
      "last_maintenance": "date",
      "next_maintenance": "date",
      "position_3d": {
        "x": "number",
        "y": "number",
        "z": "number"
      }
    }
  ],
  "ai_insights": {
    "health_score": "number (0-100)",
    "risk_level": "low | medium | high | critical",
    "predictions": [
      {
        "type": "failure | maintenance | efficiency",
        "description": "string",
        "probability": "number (0-1)",
        "estimated_date": "date",
        "recommended_actions": ["string"]
      }
    ],
    "anomalies": [
      {
        "detected_at": "timestamp",
        "type": "string",
        "severity": "low | medium | high",
        "description": "string"
      }
    ]
  },
  "historical_data": {
    "uptime_percentage": "number",
    "total_runtime_hours": "number",
    "maintenance_count": "number",
    "failure_count": "number",
    "last_failure": "timestamp"
  }
}
\`\`\`

#### Location with Machines
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postal_code": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "contact": {
    "name": "string",
    "phone": "string",
    "email": "string"
  },
  "machines_count": "number",
  "active_machines": "number",
  "machines": [
    {
      "id": "uuid",
      "name": "string",
      "model": "string",
      "type": "string",
      "status": "operational | maintenance | offline | critical",
      "health_score": "number",
      "image_url": "string"
    }
  ],
  "created_at": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/locations
GET    /api/locations/:id/machines
GET    /api/machines/:id/analysis
GET    /api/machines/:id/metrics/realtime
GET    /api/machines/:id/components
GET    /api/machines/:id/ai-insights
GET    /api/machines/:id/historical
GET    /api/machines/:id/model-3d
\`\`\`

---

## 📊 Monitoramento

### Página
- `/dashboard/monitoring` - Monitoramento em tempo real de todas as máquinas

### Estruturas JSON

#### Monitoring Overview
\`\`\`json
{
  "locations": [
    {
      "id": "uuid",
      "name": "string",
      "machines_count": "number",
      "active_machines": "number",
      "alerts_count": "number",
      "machines": [
        {
          "id": "uuid",
          "name": "string",
          "status": "operational | maintenance | offline | critical",
          "health_score": "number",
          "current_metrics": {
            "temperature": "number",
            "vibration": "number",
            "pressure": "number",
            "efficiency": "number"
          },
          "alerts": [
            {
              "type": "critical | warning | info",
              "message": "string",
              "timestamp": "timestamp"
            }
          ]
        }
      ]
    }
  ],
  "summary": {
    "total_machines": "number",
    "operational": "number",
    "maintenance": "number",
    "offline": "number",
    "critical": "number",
    "active_alerts": "number"
  }
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/monitoring/overview
GET    /api/monitoring/realtime?location_id=
WS     /ws/monitoring (WebSocket para dados em tempo real)
\`\`\`

---

## 🔧 Oficina Virtual

### Página
- `/dashboard/workshop` - Gerenciamento de oficina e manutenções

### Estruturas JSON

#### Workshop Task
\`\`\`json
{
  "id": "uuid",
  "machine_id": "uuid",
  "machine_name": "string",
  "service_type": "preventive | corrective | inspection | upgrade",
  "status": "scheduled | in_progress | completed | cancelled",
  "scheduled_date": "timestamp",
  "started_at": "timestamp",
  "completed_at": "timestamp",
  "technician": {
    "id": "uuid",
    "name": "string",
    "specialization": "string"
  },
  "work_orders": [
    {
      "id": "uuid",
      "description": "string",
      "status": "pending | completed",
      "time_spent": "number (minutes)"
    }
  ],
  "parts_used": [
    {
      "part_id": "uuid",
      "part_name": "string",
      "quantity": "number",
      "cost": "number"
    }
  ],
  "labor_cost": "number",
  "total_cost": "number",
  "notes": "string",
  "before_photos": ["string"],
  "after_photos": ["string"]
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/workshop/tasks
POST   /api/workshop/tasks
GET    /api/workshop/tasks/:id
PUT    /api/workshop/tasks/:id
POST   /api/workshop/tasks/:id/start
POST   /api/workshop/tasks/:id/complete
\`\`\`

---

## 🚚 Transporte & Reboque

### Página
- `/dashboard/transport` - Gerenciamento de transporte e reboque de máquinas

### Estruturas JSON

#### Transport Request
\`\`\`json
{
  "id": "uuid",
  "type": "transport | towing | emergency",
  "status": "requested | scheduled | in_transit | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "machine": {
    "id": "uuid",
    "name": "string",
    "model": "string",
    "weight": "number (kg)",
    "dimensions": {
      "length": "number (m)",
      "width": "number (m)",
      "height": "number (m)"
    }
  },
  "origin": {
    "location_id": "uuid",
    "location_name": "string",
    "address": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "contact": {
      "name": "string",
      "phone": "string"
    }
  },
  "destination": {
    "location_id": "uuid",
    "location_name": "string",
    "address": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "contact": {
      "name": "string",
      "phone": "string"
    }
  },
  "scheduled_date": "timestamp",
  "pickup_time": "timestamp",
  "delivery_time": "timestamp",
  "vehicle": {
    "id": "uuid",
    "type": "truck | crane | flatbed",
    "plate": "string",
    "capacity": "number (kg)"
  },
  "driver": {
    "id": "uuid",
    "name": "string",
    "phone": "string",
    "license": "string"
  },
  "route": {
    "distance": "number (km)",
    "estimated_duration": "number (minutes)",
    "waypoints": [
      {
        "lat": "number",
        "lng": "number",
        "timestamp": "timestamp"
      }
    ]
  },
  "cost": {
    "base_rate": "number",
    "distance_rate": "number",
    "additional_fees": "number",
    "total": "number"
  },
  "special_requirements": ["string"],
  "notes": "string",
  "photos": ["string"],
  "signature": "string (base64)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/transport/requests
POST   /api/transport/requests
GET    /api/transport/requests/:id
PUT    /api/transport/requests/:id
PATCH  /api/transport/requests/:id/status
GET    /api/transport/vehicles
GET    /api/transport/drivers
GET    /api/transport/route/:id
\`\`\`

---

## ⚙️ Automatizar Fluxos

### Página
- `/dashboard/automation` - Configuração de automações e workflows

### Estruturas JSON

#### Automation Rule
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "enabled": "boolean",
  "trigger": {
    "type": "metric_threshold | schedule | event | manual",
    "conditions": [
      {
        "field": "temperature | vibration | pressure | efficiency",
        "operator": "gt | lt | eq | gte | lte",
        "value": "number",
        "duration": "number (seconds)"
      }
    ],
    "schedule": {
      "frequency": "daily | weekly | monthly",
      "time": "HH:mm",
      "days": ["monday", "tuesday"]
    }
  },
  "actions": [
    {
      "type": "create_task | send_notification | send_email | call_webhook",
      "config": {
        "task_template": {
          "title": "string",
          "description": "string",
          "priority": "string",
          "assigned_to": "uuid"
        },
        "notification": {
          "title": "string",
          "message": "string",
          "recipients": ["uuid"]
        },
        "email": {
          "to": ["string"],
          "subject": "string",
          "body": "string"
        },
        "webhook": {
          "url": "string",
          "method": "POST | GET",
          "headers": {},
          "body": {}
        }
      }
    }
  ],
  "filters": {
    "locations": ["uuid"],
    "machines": ["uuid"],
    "machine_types": ["string"]
  },
  "execution_log": [
    {
      "timestamp": "timestamp",
      "status": "success | failed",
      "details": "string"
    }
  ],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/automation/rules
POST   /api/automation/rules
GET    /api/automation/rules/:id
PUT    /api/automation/rules/:id
DELETE /api/automation/rules/:id
PATCH  /api/automation/rules/:id/toggle
GET    /api/automation/rules/:id/logs
POST   /api/automation/rules/:id/test
\`\`\`

---

## 📦 Inventário

### Página
- `/dashboard/inventory` - Gerenciamento de peças e estoque

### Estruturas JSON

#### Inventory Item
\`\`\`json
{
  "id": "uuid",
  "part_number": "string",
  "name": "string",
  "description": "string",
  "category": "bearing | motor | seal | filter | belt | electronic | hydraulic",
  "manufacturer": "string",
  "supplier": {
    "id": "uuid",
    "name": "string",
    "contact": "string",
    "email": "string"
  },
  "compatible_machines": [
    {
      "machine_id": "uuid",
      "machine_name": "string",
      "machine_model": "string"
    }
  ],
  "quantity": {
    "available": "number",
    "reserved": "number",
    "minimum_threshold": "number",
    "reorder_point": "number"
  },
  "location": {
    "warehouse": "string",
    "shelf": "string",
    "bin": "string"
  },
  "pricing": {
    "cost": "number",
    "selling_price": "number",
    "currency": "BRL"
  },
  "specifications": {
    "weight": "number",
    "dimensions": {
      "length": "number",
      "width": "number",
      "height": "number"
    },
    "material": "string"
  },
  "images": ["string"],
  "datasheet_url": "string",
  "status": "in_stock | low_stock | out_of_stock | discontinued",
  "last_restocked": "timestamp",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

#### Stock Movement
\`\`\`json
{
  "id": "uuid",
  "item_id": "uuid",
  "type": "purchase | usage | return | adjustment | transfer",
  "quantity": "number",
  "from_location": "string",
  "to_location": "string",
  "related_task_id": "uuid",
  "related_machine_id": "uuid",
  "user_id": "uuid",
  "notes": "string",
  "cost": "number",
  "timestamp": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/inventory/items?category=&status=&search=
POST   /api/inventory/items
GET    /api/inventory/items/:id
PUT    /api/inventory/items/:id
DELETE /api/inventory/items/:id
GET    /api/inventory/items/:id/movements
POST   /api/inventory/movements
GET    /api/inventory/low-stock
GET    /api/inventory/reports
\`\`\`

---

## 🩺 Diagnósticos

### Página
- `/dashboard/diagnostics` - Diagnósticos e análises avançadas

### Estruturas JSON

#### Diagnostic Report
\`\`\`json
{
  "id": "uuid",
  "machine_id": "uuid",
  "machine_name": "string",
  "type": "routine | troubleshooting | predictive | post_failure",
  "status": "scheduled | in_progress | completed | failed",
  "scheduled_at": "timestamp",
  "started_at": "timestamp",
  "completed_at": "timestamp",
  "technician": {
    "id": "uuid",
    "name": "string"
  },
  "tests_performed": [
    {
      "test_id": "uuid",
      "test_name": "string",
      "result": "pass | fail | warning",
      "value": "string",
      "expected_range": "string",
      "notes": "string"
    }
  ],
  "findings": [
    {
      "id": "uuid",
      "severity": "critical | high | medium | low",
      "category": "mechanical | electrical | hydraulic | structural",
      "description": "string",
      "affected_components": ["string"],
      "recommended_actions": ["string"],
      "estimated_cost": "number",
      "priority": "urgent | high | medium | low"
    }
  ],
  "overall_health_score": "number (0-100)",
  "ai_analysis": {
    "failure_probability": "number (0-1)",
    "estimated_remaining_life": "number (days)",
    "recommended_maintenance_date": "date",
    "similar_cases": [
      {
        "machine_id": "uuid",
        "similarity_score": "number",
        "outcome": "string"
      }
    ]
  },
  "attachments": [
    {
      "type": "image | video | pdf | thermal_image | vibration_data",
      "url": "string",
      "name": "string"
    }
  ],
  "next_diagnostic_date": "date",
  "created_at": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/diagnostics?machine_id=&status=&date_from=&date_to=
POST   /api/diagnostics
GET    /api/diagnostics/:id
PUT    /api/diagnostics/:id
POST   /api/diagnostics/:id/start
POST   /api/diagnostics/:id/complete
GET    /api/diagnostics/schedule?machine_id=
\`\`\`

---

## 📄 Relatórios

### Página
- `/dashboard/reports` - Visualização e geração de relatórios

### Estruturas JSON

#### Machine Report
\`\`\`json
{
  "id": "uuid",
  "machine_id": "uuid",
  "machine": {
    "id": "uuid",
    "name": "string",
    "model": "string",
    "serial_number": "string",
    "type": "string",
    "location": {
      "id": "uuid",
      "name": "string"
    }
  },
  "report_type": "health | maintenance | performance | failure_analysis",
  "generated_at": "timestamp",
  "period": {
    "start": "date",
    "end": "date"
  },
  "summary": {
    "overall_health": "number (0-100)",
    "uptime_percentage": "number",
    "total_runtime_hours": "number",
    "maintenance_count": "number",
    "issues_found": "number",
    "issues_resolved": "number"
  },
  "metrics": {
    "temperature": {
      "min": "number",
      "max": "number",
      "avg": "number",
      "trend": "increasing | decreasing | stable"
    },
    "vibration": {
      "min": "number",
      "max": "number",
      "avg": "number",
      "trend": "increasing | decreasing | stable"
    },
    "efficiency": {
      "min": "number",
      "max": "number",
      "avg": "number",
      "trend": "increasing | decreasing | stable"
    }
  },
  "components_analysis": [
    {
      "component_id": "uuid",
      "component_name": "string",
      "health_score": "number",
      "wear_level": "number (0-100)",
      "estimated_life_remaining": "number (days)",
      "issues": ["string"],
      "recommendations": ["string"],
      "images": [
        {
          "type": "visual | thermal | xray",
          "url": "string",
          "annotations": [
            {
              "x": "number",
              "y": "number",
              "label": "string",
              "severity": "critical | warning | info"
            }
          ]
        }
      ]
    }
  ],
  "ai_insights": {
    "predictions": [
      {
        "type": "failure | maintenance | efficiency_drop",
        "probability": "number (0-1)",
        "estimated_date": "date",
        "confidence": "number (0-1)",
        "description": "string"
      }
    ],
    "recommendations": [
      {
        "priority": "urgent | high | medium | low",
        "action": "string",
        "expected_benefit": "string",
        "estimated_cost": "number"
      }
    ]
  },
  "maintenance_history": [
    {
      "date": "timestamp",
      "type": "preventive | corrective",
      "description": "string",
      "cost": "number",
      "downtime": "number (hours)"
    }
  ],
  "cost_analysis": {
    "maintenance_costs": "number",
    "parts_costs": "number",
    "downtime_costs": "number",
    "total_costs": "number"
  },
  "charts": {
    "efficiency_trend": [
      {
        "date": "date",
        "value": "number"
      }
    ],
    "temperature_trend": [
      {
        "timestamp": "timestamp",
        "value": "number"
      }
    ]
  },
  "technician_notes": "string",
  "attachments": ["string"]
}
\`\`\`

#### Report Scan Animation (para novo relatório)
\`\`\`json
{
  "machine_id": "uuid",
  "scan_status": "initializing | scanning | analyzing | generating | completed",
  "scan_progress": "number (0-100)",
  "current_component": "string",
  "estimated_completion": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/reports?location_id=&machine_id=&type=&date_from=&date_to=
POST   /api/reports/generate
GET    /api/reports/:id
GET    /api/reports/:id/pdf
POST   /api/reports/:id/print
GET    /api/reports/scan/:machine_id (SSE ou WebSocket para animação)
\`\`\`

---

## 👥 Equipe & Usuários

### Páginas
- `/dashboard/team` - Dashboard de métricas e performance da equipe
- `/dashboard/users` - Gerenciamento de usuários e permissões

### Funcionalidades Principais

#### Dashboard de Equipe (/dashboard/team)
- Métricas de equipe (Total de Funcionários, Candidatos, Salário Total, Taxa de Presença)
- Distribuição de membros por função (Técnicos, Engenheiros, Operadores, etc.)
- Relatório de presença em heatmap
- Insights de IA sobre performance da equipe
- Quadro Kanban de tarefas de RH
- Filtros por período (30 dias, 3 meses, 6 meses)

#### Gerenciamento de Usuários (/dashboard/users)
- Lista completa de usuários com avatares, emails, funções e status
- Busca e filtros por nome, email, função e status
- Adição de novos usuários
- Edição de funções e permissões
- Desativação/reativação de usuários
- Visualização de atividade e último acesso

### Estruturas JSON

#### Team Dashboard Metrics
\`\`\`json
{
  "period": "30days | 3months | 6months",
  "metrics": {
    "total_employees": {
      "value": "number",
      "change_percentage": "number",
      "change_from_last_period": "number"
    },
    "job_applicants": {
      "value": "number",
      "change_percentage": "number",
      "change_from_last_period": "number"
    },
    "total_salary": {
      "value": "number",
      "currency": "BRL",
      "change_percentage": "number",
      "change_from_last_period": "number"
    },
    "attendance_rate": {
      "value": "number",
      "unit": "%",
      "change_percentage": "number",
      "change_from_last_period": "number"
    },
    "worked_hours": {
      "value": "number",
      "average_per_employee": "number"
    },
    "completion_rate": {
      "value": "number",
      "unit": "%",
      "tasks_completed": "number",
      "tasks_total": "number"
    }
  },
  "distribution": [
    {
      "role": "Técnicos de Manutenção",
      "count": "number",
      "percentage": "number",
      "average_salary": "number"
    },
    {
      "role": "Engenheiros",
      "count": "number",
      "percentage": "number",
      "average_salary": "number"
    },
    {
      "role": "Operadores",
      "count": "number",
      "percentage": "number",
      "average_salary": "number"
    },
    {
      "role": "Analistas",
      "count": "number",
      "percentage": "number",
      "average_salary": "number"
    },
    {
      "role": "Supervisores",
      "count": "number",
      "percentage": "number",
      "average_salary": "number"
    }
  ],
  "attendance_heatmap": [
    {
      "date": "date",
      "on_time": "number",
      "late": "number",
      "absent": "number",
      "total": "number"
    }
  ],
  "ai_insights": [
    {
      "type": "performance | suggestion | alert",
      "priority": "high | medium | low",
      "title": "string",
      "description": "string",
      "icon": "trending-up | award | file-text",
      "timestamp": "timestamp"
    }
  ],
  "recent_tasks": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": "new_request | in_progress | completed",
      "tags": ["string"],
      "assigned_to": {
        "id": "uuid",
        "name": "string"
      }
    }
  ]
}
\`\`\`

#### User Management List
\`\`\`json
{
  "users": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "avatar_url": "string",
      "avatar_color": "string",
      "role": "master | admin | manager | technician | operator | viewer",
      "job_title": "string",
      "department": "string",
      "company_role": "Técnico | Engenheiro | Operador | Analista | Supervisor",
      "status": "online | idle | offline | invited",
      "last_active": "timestamp",
      "joined_date": "date",
      "invited_date": "date",
      "locations_access": [
        {
          "location_id": "uuid",
          "location_name": "string"
        }
      ],
      "teams": [
        {
          "team_id": "uuid",
          "team_name": "string",
          "role_in_team": "string"
        }
      ],
      "statistics": {
        "tasks_completed": "number",
        "tasks_in_progress": "number",
        "average_completion_time": "number (hours)",
        "efficiency_score": "number (0-100)"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "total_pages": "number"
  }
}
\`\`\`

#### User Detail
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "avatar_url": "string",
  "role": "master | admin | manager | technician | operator | viewer",
  "job_title": "string",
  "department": "string",
  "company_role": "string",
  "status": "active | inactive | invited",
  "permissions": {
    "can_view_dashboard": "boolean",
    "can_manage_machines": "boolean",
    "can_create_tasks": "boolean",
    "can_manage_team": "boolean",
    "can_view_reports": "boolean",
    "can_manage_billing": "boolean",
    "can_manage_users": "boolean",
    "can_view_all_locations": "boolean",
    "can_use_ai_features": "boolean"
  },
  "locations_access": [
    {
      "location_id": "uuid",
      "location_name": "string",
      "access_level": "full | view_only"
    }
  ],
  "teams": [
    {
      "team_id": "uuid",
      "team_name": "string",
      "role_in_team": "leader | member",
      "joined_at": "timestamp"
    }
  ],
  "activity": {
    "last_login": "timestamp",
    "last_action": "timestamp",
    "login_count": "number",
    "active_sessions": "number"
  },
  "statistics": {
    "tasks_completed_total": "number",
    "tasks_in_progress": "number",
    "machines_monitored": "number",
    "reports_generated": "number",
    "average_task_completion_time": "number (hours)",
    "efficiency_score": "number (0-100)"
  },
  "recent_activity": [
    {
      "action": "string",
      "description": "string",
      "timestamp": "timestamp",
      "ip_address": "string",
      "location": "string"
    }
  ],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

#### User Creation/Invitation
\`\`\`json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "admin | manager | technician | operator | viewer",
  "job_title": "string",
  "department": "string",
  "company_role": "Técnico | Engenheiro | Operador | Analista | Supervisor",
  "locations_access": ["uuid"],
  "teams": ["uuid"],
  "send_invitation_email": "boolean",
  "permissions": {
    "can_view_dashboard": "boolean",
    "can_manage_machines": "boolean",
    "can_create_tasks": "boolean",
    "can_view_reports": "boolean",
    "can_view_all_locations": "boolean"
  }
}
\`\`\`

#### User Update
\`\`\`json
{
  "name": "string",
  "phone": "string",
  "role": "admin | manager | technician | operator | viewer",
  "job_title": "string",
  "department": "string",
  "company_role": "string",
  "locations_access": ["uuid"],
  "teams": ["uuid"],
  "status": "active | inactive",
  "permissions": {
    "can_view_dashboard": "boolean",
    "can_manage_machines": "boolean",
    "can_create_tasks": "boolean",
    "can_manage_team": "boolean",
    "can_view_reports": "boolean",
    "can_manage_billing": "boolean",
    "can_manage_users": "boolean"
  }
}
\`\`\`

#### Team (grupo de usuários)
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "type": "maintenance | operations | engineering | management",
  "leader": {
    "user_id": "uuid",
    "name": "string",
    "email": "string"
  },
  "members": [
    {
      "user_id": "uuid",
      "name": "string",
      "role_in_team": "leader | member",
      "joined_at": "timestamp"
    }
  ],
  "locations": ["uuid"],
  "machines_assigned": ["uuid"],
  "metrics": {
    "total_tasks": "number",
    "completed_tasks": "number",
    "efficiency_rate": "number",
    "average_completion_time": "number (hours)"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

#### Account Switcher Data
\`\`\`json
{
  "current_user_id": "uuid",
  "accounts": [
    {
      "user_id": "uuid",
      "name": "string",
      "email": "string",
      "avatar_url": "string",
      "role": "string",
      "company": "string",
      "last_accessed": "timestamp",
      "is_current": "boolean"
    }
  ]
}
\`\`\`

### Endpoints

#### Team Dashboard
\`\`\`
GET    /api/team/dashboard/metrics?period=30days|3months|6months
GET    /api/team/distribution
GET    /api/team/attendance/heatmap?date_from=&date_to=
GET    /api/team/ai-insights
GET    /api/team/tasks
GET    /api/team/export?period=
\`\`\`

#### User Management
\`\`\`
GET    /api/users?role=&status=&search=&page=&limit=
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/role
PATCH  /api/users/:id/status
PATCH  /api/users/:id/permissions
POST   /api/users/:id/resend-invitation
GET    /api/users/:id/activity
GET    /api/users/:id/statistics
\`\`\`

#### Teams (grupos)
\`\`\`
GET    /api/teams
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:user_id
GET    /api/teams/:id/metrics
\`\`\`

#### Account Switcher
\`\`\`
GET    /api/auth/accounts
POST   /api/auth/switch-account
\`\`\`

### Regras de Acesso por Role

#### Master/Owner
- Acesso completo a todas as funcionalidades
- Gerenciar todos os usuários e suas permissões
- Alterar planos e faturamento
- Ver todas as localizações e máquinas
- Acessar métricas financeiras completas

#### Admin
- Gerenciar usuários (exceto outros admins e master)
- Ver e gerenciar todas as máquinas e localizações
- Criar e gerenciar todas as tarefas
- Acessar todos os relatórios
- Não pode alterar faturamento ou plano

#### Manager
- Ver métricas do seu time/equipe
- Gerenciar tarefas do seu time
- Ver máquinas das localizações atribuídas
- Criar relatórios
- Adicionar membros ao seu time (role técnico/operador)

#### Technician
- Ver e atualizar tarefas atribuídas
- Ver máquinas das localizações atribuídas
- Criar diagnósticos
- Ver relatórios relacionados às suas tarefas

#### Operator
- Ver máquinas atribuídas
- Ver suas tarefas
- Atualizar status de tarefas atribuídas
- Monitoramento básico

#### Viewer
- Apenas visualização de dashboards
- Ver relatórios (sem edição)
- Sem permissões de criação ou edição

### Validações Importantes

1. **Master Role**: Apenas o criador da conta pode ser Master. Não é possível promover outro usuário para Master.
2. **Email único**: Cada email só pode estar associado a uma conta por empresa.
3. **Limite de usuários**: Respeitado conforme o plano (Starter: 5, Professional: 20, Enterprise: ilimitado).
4. **Permissões hierárquicas**: Usuários só podem gerenciar outros com roles menores ou iguais.
5. **Localizações atribuídas**: Usuários não-admin só veem dados das localizações atribuídas a eles.
6. **Times**: Cada usuário pode pertencer a múltiplos times.

### WebSocket Events para Team

\`\`\`javascript
// Eventos relacionados a equipe/usuários
{
  "event": "user.online",
  "data": {
    "user_id": "uuid",
    "status": "online | idle | offline"
  }
}

{
  "event": "user.status_changed",
  "data": {
    "user_id": "uuid",
    "status": "online | idle | offline"
  }
}

{
  "event": "team.member_added",
  "data": {
    "team_id": "uuid",
    "user_id": "uuid"
  }
}

{
  "event": "team.metrics_updated",
  "data": {
    "team_id": "uuid",
    "metrics": { /* updated metrics */ }
  }
}
\`\`\`

---

## 💳 Faturamento/Planos

### Página
- `/dashboard/pricing` - Seleção e alteração de planos
- `/dashboard/settings` (aba Faturamento) - Gerenciamento de assinatura

### Estruturas JSON

#### Plan
\`\`\`json
{
  "id": "string",
  "name": "Starter | Professional | Enterprise",
  "price_monthly": "number",
  "price_annual": "number",
  "features": [
    {
      "name": "string",
      "included": "boolean",
      "limit": "number | null"
    }
  ],
  "limits": {
    "max_machines": "number",
    "max_locations": "number",
    "max_users": "number",
    "storage_gb": "number"
  },
  "ai_features": {
    "predictive_analysis": "boolean",
    "advanced_diagnostics": "boolean",
    "ai_recommendations": "boolean"
  },
  "support": {
    "type": "email | priority | dedicated",
    "response_time": "string"
  }
}
\`\`\`

#### Subscription
\`\`\`json
{
  "id": "uuid",
  "user_id": "uuid",
  "plan_id": "string",
  "status": "active | cancelled | expired | past_due",
  "billing_cycle": "monthly | annual",
  "current_period_start": "date",
  "current_period_end": "date",
  "next_billing_date": "date",
  "amount": "number",
  "currency": "BRL",
  "payment_method": {
    "type": "credit_card | debit_card | boleto | pix",
    "last4": "string",
    "brand": "string",
    "expires": "MM/YY"
  },
  "usage": {
    "machines_count": "number",
    "locations_count": "number",
    "users_count": "number",
    "storage_used_gb": "number"
  },
  "created_at": "timestamp",
  "cancelled_at": "timestamp"
}
\`\`\`

#### Invoice
\`\`\`json
{
  "id": "uuid",
  "subscription_id": "uuid",
  "amount": "number",
  "currency": "BRL",
  "status": "paid | pending | failed | refunded",
  "invoice_date": "date",
  "due_date": "date",
  "paid_date": "date",
  "payment_method": "string",
  "invoice_url": "string",
  "items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "total": "number"
    }
  ]
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/plans
GET    /api/subscription/current
POST   /api/subscription/change-plan
POST   /api/subscription/cancel
POST   /api/subscription/reactivate
GET    /api/subscription/invoices
GET    /api/subscription/usage
POST   /api/payment-methods
PUT    /api/payment-methods/:id
DELETE /api/payment-methods/:id
\`\`\`

---

## ⚙️ Configurações

### Página
- `/dashboard/settings` - Configurações do usuário e da conta

### Estruturas JSON

#### User Settings
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "company": "string",
    "avatar_url": "string",
    "role": "string"
  },
  "preferences": {
    "language": "pt-BR | en-US | es-ES",
    "timezone": "string",
    "date_format": "DD/MM/YYYY | MM/DD/YYYY",
    "time_format": "24h | 12h",
    "theme": "light | dark | auto",
    "notifications": {
      "email": {
        "alerts": "boolean",
        "reports": "boolean",
        "marketing": "boolean"
      },
      "push": {
        "alerts": "boolean",
        "tasks": "boolean",
        "messages": "boolean"
      }
    }
  },
  "security": {
    "two_factor_enabled": "boolean",
    "last_password_change": "timestamp",
    "active_sessions": [
      {
        "id": "uuid",
        "device": "string",
        "location": "string",
        "last_active": "timestamp"
      }
    ]
  }
}
\`\`\`

#### Company Settings
\`\`\`json
{
  "company": {
    "id": "uuid",
    "name": "string",
    "legal_name": "string",
    "tax_id": "string",
    "industry": "string",
    "size": "1-10 | 11-50 | 51-200 | 201-500 | 500+",
    "address": {
      "street": "string",
      "number": "string",
      "complement": "string",
      "city": "string",
      "state": "string",
      "postal_code": "string",
      "country": "string"
    },
    "contact": {
      "phone": "string",
      "email": "string",
      "website": "string"
    },
    "logo_url": "string"
  },
  "team_members": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "role": "admin | manager | operator | viewer",
      "status": "active | invited | inactive",
      "invited_at": "timestamp",
      "joined_at": "timestamp"
    }
  ]
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/settings/user
PUT    /api/settings/user
PUT    /api/settings/password
POST   /api/settings/avatar
GET    /api/settings/company
PUT    /api/settings/company
GET    /api/settings/team
POST   /api/settings/team/invite
DELETE /api/settings/team/:id
PUT    /api/settings/team/:id/role
POST   /api/settings/two-factor/enable
POST   /api/settings/two-factor/disable
GET    /api/settings/sessions
DELETE /api/settings/sessions/:id
\`\`\`

---

## 🤖 Assistente de IA

### Página/Componente
- Modal flutuante acessível globalmente
- Componente: `components/ai-assistant-popup.tsx`

### Estruturas JSON

#### AI Conversation
\`\`\`json
{
  "conversation_id": "uuid",
  "user_id": "uuid",
  "messages": [
    {
      "id": "uuid",
      "role": "user | assistant | system",
      "content": "string",
      "timestamp": "timestamp",
      "attachments": [
        {
          "type": "image | file | chart",
          "url": "string"
        }
      ]
    }
  ],
  "context": {
    "current_page": "string",
    "selected_machine_id": "uuid",
    "selected_location_id": "uuid",
    "user_role": "string"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
\`\`\`

#### AI Action Cards
\`\`\`json
{
  "actions": [
    {
      "id": "analyze_machine",
      "title": "Analisar Máquinas",
      "description": "Análise detalhada do status e performance das suas máquinas industriais",
      "icon": "activity",
      "gradient": "from-blue-500 to-blue-600"
    },
    {
      "id": "schedule_maintenance",
      "title": "Agendar Manutenção",
      "description": "Criar cronograma de manutenção preventiva baseado em dados históricos",
      "icon": "wrench",
      "gradient": "from-purple-500 to-pink-500"
    },
    {
      "id": "generate_report",
      "title": "Gerar Relatório",
      "description": "Relatórios detalhados de produção e eficiência operacional",
      "icon": "bar-chart",
      "gradient": "from-orange-500 to-red-500"
    },
    {
      "id": "diagnose_problem",
      "title": "Diagnosticar Problemas",
      "description": "Identificar e resolver problemas em tempo real com IA preditiva",
      "icon": "alert-circle",
      "gradient": "from-green-500 to-emerald-500"
    },
    {
      "id": "automate_workflow",
      "title": "Automatizar Fluxos",
      "description": "Criar automações inteligentes para processos repetitivos",
      "icon": "zap",
      "gradient": "from-violet-500 to-purple-500"
    },
    {
      "id": "consult_docs",
      "title": "Consultar Docs",
      "description": "Buscar informações sobre funcionalidades e recursos do sistema",
      "icon": "book-open",
      "gradient": "from-amber-500 to-yellow-500"
    }
  ]
}
\`\`\`

#### AI Query
\`\`\`json
{
  "query": "string",
  "action_id": "string | null",
  "context": {
    "machine_id": "uuid | null",
    "location_id": "uuid | null",
    "page": "string",
    "filters": {}
  }
}
\`\`\`

#### AI Response
\`\`\`json
{
  "response": "string",
  "suggestions": ["string"],
  "actions": [
    {
      "type": "navigate | create_task | generate_report | schedule",
      "label": "string",
      "data": {}
    }
  ],
  "related_data": {
    "machines": [],
    "tasks": [],
    "reports": []
  }
}
\`\`\`

### Endpoints
\`\`\`
POST   /api/ai/chat
GET    /api/ai/conversations
GET    /api/ai/conversations/:id
DELETE /api/ai/conversations/:id
POST   /api/ai/actions/:action_id
\`\`\`

---

## 🔔 Notificações

### Estruturas JSON

#### Notification
\`\`\`json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "alert | task | report | system | maintenance",
  "priority": "low | medium | high | urgent",
  "title": "string",
  "message": "string",
  "data": {
    "machine_id": "uuid",
    "task_id": "uuid",
    "report_id": "uuid"
  },
  "action_url": "string",
  "read": "boolean",
  "read_at": "timestamp",
  "created_at": "timestamp"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/notifications?unread=true
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/:id
WS     /ws/notifications (WebSocket para notificações em tempo real)
\`\`\`

---

## 🔍 Busca Global

### Estruturas JSON

#### Search Query
\`\`\`json
{
  "query": "string",
  "filters": {
    "types": ["machines", "tasks", "reports", "locations"],
    "date_from": "date",
    "date_to": "date"
  }
}
\`\`\`

#### Search Results
\`\`\`json
{
  "results": [
    {
      "type": "machine | task | report | location | user | document",
      "id": "uuid",
      "title": "string",
      "subtitle": "string",
      "url": "string",
      "icon": "string",
      "highlight": "string",
      "score": "number"
    }
  ],
  "total": "number",
  "query_time": "number (ms)"
}
\`\`\`

### Endpoints
\`\`\`
GET    /api/search?q=&types=&limit=
\`\`\`

---

## 🌐 WebSocket Events

### Eventos em Tempo Real

\`\`\`javascript
// Conexão WebSocket
ws://api.domain.com/ws?token=JWT_TOKEN

// Eventos que o frontend RECEBE:
{
  "event": "machine.metrics.update",
  "data": {
    "machine_id": "uuid",
    "metrics": { /* realtime metrics */ }
  }
}

{
  "event": "machine.alert",
  "data": {
    "machine_id": "uuid",
    "alert": { /* alert data */ }
  }
}

{
  "event": "task.created",
  "data": { /* task data */ }
}

{
  "event": "task.updated",
  "data": { /* task data */ }
}

{
  "event": "notification.new",
  "data": { /* notification data */ }
}

{
  "event": "report.generated",
  "data": { /* report data */ }
}

// Eventos que o frontend ENVIA:
{
  "event": "subscribe",
  "channels": ["machine.123", "location.456", "user.789"]
}

{
  "event": "unsubscribe",
  "channels": ["machine.123"]
}
\`\`\`

---

## 🔐 Autenticação & Autorização

### Headers Obrigatórios
\`\`\`
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
X-Client-Version: 1.0.0
\`\`\`

### JWT Token Payload
\`\`\`json
{
  "user_id": "uuid",
  "email": "string",
  "role": "admin | manager | operator | viewer",
  "company_id": "uuid",
  "plan": "starter | professional | enterprise",
  "exp": "timestamp",
  "iat": "timestamp"
}
\`\`\`

### Permissões por Role

#### Admin
- Acesso total a todas as funcionalidades
- Gerenciar usuários e configurações da empresa
- Modificar planos e faturamento

#### Manager
- Visualizar e gerenciar máquinas, tarefas e relatórios
- Criar e modificar automações
- Visualizar custos e métricas

#### Operator
- Visualizar máquinas e monitoramento
- Criar e atualizar tarefas atribuídas
- Visualizar relatórios

#### Viewer
- Apenas visualização de dashboards e relatórios
- Sem permissões de edição

---

## 📊 Códigos de Status HTTP

\`\`\`
200 OK - Requisição bem-sucedida
201 Created - Recurso criado com sucesso
204 No Content - Requisição bem-sucedida sem conteúdo de retorno
400 Bad Request - Dados inválidos ou malformados
401 Unauthorized - Token inválido ou ausente
403 Forbidden - Usuário não tem permissão
404 Not Found - Recurso não encontrado
409 Conflict - Conflito com estado atual do recurso
422 Unprocessable Entity - Validação de dados falhou
429 Too Many Requests - Rate limit excedido
500 Internal Server Error - Erro no servidor
503 Service Unavailable - Serviço temporariamente indisponível
\`\`\`

---

## 🚀 Rate Limiting

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
\`\`\`

Limites por plano:
- **Starter**: 1000 requests/hora
- **Professional**: 5000 requests/hora
- **Enterprise**: 10000 requests/hora

---

## 📝 Paginação

Todas as listas seguem o padrão:

### Request
\`\`\`
GET /api/endpoint?page=1&limit=20&sort=created_at&order=desc
\`\`\`

### Response
\`\`\`json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
\`\`\`

---

## 🎯 Notas Importantes para o Backend

### Dados a serem criados no OUTRO frontend:
- **Localizações (Locations)**: Criar, editar, deletar locais de trabalho
- **Máquinas (Machines)**: Criar, editar, deletar máquinas e seus modelos 3D

### Dados a serem gerenciados NESTE frontend:
- **Tarefas**: CRUD completo
- **Manutenções**: CRUD completo
- **Diagnósticos**: CRUD completo
- **Relatórios**: Geração e visualização
- **Transporte & Reboque**: CRUD completo
- **Inventário**: CRUD completo
- **Automações**: CRUD completo
- **Faturamento**: Alteração de planos e gerenciamento de assinatura
- **Configurações**: Configurações de usuário e empresa

### Integrações Necessárias:
1. **API de Mapas**: Para Transporte & Reboque (ex: Google Maps, Mapbox)
2. **WebSocket**: Para dados em tempo real
3. **AI/ML Service**: Para análises preditivas e assistente de IA
4. **Serviço de Email**: Para notificações
5. **Gateway de Pagamento**: Para processamento de assinaturas
6. **Storage de Arquivos**: Para imagens, PDFs, modelos 3D (ex: AWS S3, Vercel Blob)

### Considerações de Performance:
- Cache de métricas em tempo real (Redis)
- Compressão de imagens e modelos 3D
- Lazy loading para listas grandes
- Server-Sent Events (SSE) ou WebSocket para atualizações em tempo real
- Background jobs para relatórios e análises pesadas

---

## 📞 Contato & Suporte

Para dúvidas sobre esta especificação:
- Documentação completa: [link]
- API Playground: [link]
- Suporte técnico: [email]

**Versão do documento**: 1.0.0  
**Última atualização**: Janeiro 2025
email]

**Versão do documento**: 1.0.0  
**Última atualização**: Janeiro 2025
