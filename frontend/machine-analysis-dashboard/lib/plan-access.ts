// Plan access control utilities

export type PlanType = "starter" | "professional" | "enterprise"

export interface PlanLimits {
  maxMachines: number
  maxLocations: number
  maxUsers: number
  hasAIAnalysis: boolean
  hasRealtimeMonitoring: boolean
  hasPredictiveMaintenance: boolean
  hasCustomReports: boolean
  hasAPIAccess: boolean
  has3DVisualization: boolean
  hasAutomation: boolean
  reportRetentionDays: number
  supportLevel: "email" | "priority" | "dedicated"
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  starter: {
    maxMachines: 10,
    maxLocations: 1,
    maxUsers: 3,
    hasAIAnalysis: false,
    hasRealtimeMonitoring: false,
    hasPredictiveMaintenance: false,
    hasCustomReports: false,
    hasAPIAccess: false,
    has3DVisualization: false,
    hasAutomation: false,
    reportRetentionDays: 30,
    supportLevel: "email",
  },
  professional: {
    maxMachines: 50,
    maxLocations: 5,
    maxUsers: 10,
    hasAIAnalysis: true,
    hasRealtimeMonitoring: true,
    hasPredictiveMaintenance: true,
    hasCustomReports: true,
    hasAPIAccess: false,
    has3DVisualization: true,
    hasAutomation: true,
    reportRetentionDays: 365,
    supportLevel: "priority",
  },
  enterprise: {
    maxMachines: Infinity,
    maxLocations: Infinity,
    maxUsers: Infinity,
    hasAIAnalysis: true,
    hasRealtimeMonitoring: true,
    hasPredictiveMaintenance: true,
    hasCustomReports: true,
    hasAPIAccess: true,
    has3DVisualization: true,
    hasAutomation: true,
    reportRetentionDays: Infinity,
    supportLevel: "dedicated",
  },
}

export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan]
}

export function canAccessFeature(
  userPlan: PlanType,
  feature: keyof Omit<PlanLimits, "maxMachines" | "maxLocations" | "maxUsers" | "reportRetentionDays" | "supportLevel">
): boolean {
  const limits = getPlanLimits(userPlan)
  return limits[feature]
}

export function hasReachedLimit(
  userPlan: PlanType,
  limitType: "maxMachines" | "maxLocations" | "maxUsers",
  currentCount: number
): boolean {
  const limits = getPlanLimits(userPlan)
  const maxLimit = limits[limitType]
  if (maxLimit === Infinity) return false
  return currentCount >= maxLimit
}

export function getPlanBadgeColor(plan: PlanType): string {
  switch (plan) {
    case "starter":
      return "bg-slate-500"
    case "professional":
      return "bg-blue-600"
    case "enterprise":
      return "bg-purple-600"
    default:
      return "bg-gray-500"
  }
}

export function getPlanName(plan: PlanType): string {
  switch (plan) {
    case "starter":
      return "Plano Starter"
    case "professional":
      return "Plano Professional"
    case "enterprise":
      return "Plano Enterprise"
    default:
      return "Plano Desconhecido"
  }
}
