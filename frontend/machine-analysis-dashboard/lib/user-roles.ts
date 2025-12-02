export type UserRole = 'master' | 'admin' | 'manager' | 'technician' | 'operator' | 'viewer'
export type JobFunction = 'maintenance_engineer' | 'production_manager' | 'quality_inspector' | 'equipment_operator' | 'technician' | 'analyst' | 'supervisor' | 'other'

export interface UserPermissions {
  canManageUsers: boolean
  canManageTeams: boolean
  canManageAllMachines: boolean
  canCreateReports: boolean
  canViewAllReports: boolean
  canManageBilling: boolean
  canAccessAIFeatures: boolean
  canManageWorkflows: boolean
  canViewAnalytics: boolean
  canExportData: boolean
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
  master: {
    canManageUsers: true,
    canManageTeams: true,
    canManageAllMachines: true,
    canCreateReports: true,
    canViewAllReports: true,
    canManageBilling: true,
    canAccessAIFeatures: true,
    canManageWorkflows: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  admin: {
    canManageUsers: true,
    canManageTeams: true,
    canManageAllMachines: true,
    canCreateReports: true,
    canViewAllReports: true,
    canManageBilling: false,
    canAccessAIFeatures: true,
    canManageWorkflows: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  manager: {
    canManageUsers: false,
    canManageTeams: true,
    canManageAllMachines: false,
    canCreateReports: true,
    canViewAllReports: false,
    canManageBilling: false,
    canAccessAIFeatures: true,
    canManageWorkflows: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  technician: {
    canManageUsers: false,
    canManageTeams: false,
    canManageAllMachines: false,
    canCreateReports: true,
    canViewAllReports: false,
    canManageBilling: false,
    canAccessAIFeatures: false,
    canManageWorkflows: false,
    canViewAnalytics: false,
    canExportData: false,
  },
  operator: {
    canManageUsers: false,
    canManageTeams: false,
    canManageAllMachines: false,
    canCreateReports: false,
    canViewAllReports: false,
    canManageBilling: false,
    canAccessAIFeatures: false,
    canManageWorkflows: false,
    canViewAnalytics: false,
    canExportData: false,
  },
  viewer: {
    canManageUsers: false,
    canManageTeams: false,
    canManageAllMachines: false,
    canCreateReports: false,
    canViewAllReports: false,
    canManageBilling: false,
    canAccessAIFeatures: false,
    canManageWorkflows: false,
    canViewAnalytics: false,
    canExportData: false,
  },
}

export const jobFunctionLabels: Record<JobFunction, string> = {
  maintenance_engineer: 'Engenheiro de Manutenção',
  production_manager: 'Gerente de Produção',
  quality_inspector: 'Inspetor de Qualidade',
  equipment_operator: 'Operador de Equipamento',
  technician: 'Técnico',
  analyst: 'Analista',
  supervisor: 'Supervisor',
  other: 'Outro',
}

export const roleLabels: Record<UserRole, string> = {
  master: 'Master',
  admin: 'Administrador',
  manager: 'Gerente',
  technician: 'Técnico',
  operator: 'Operador',
  viewer: 'Visualizador',
}

export function getUserPermissions(role: UserRole): UserPermissions {
  return rolePermissions[role]
}

export function canAccessFeature(role: UserRole, feature: keyof UserPermissions): boolean {
  return rolePermissions[role][feature]
}
