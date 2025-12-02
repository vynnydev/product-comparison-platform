// Cliente API centralizado para buscar dados do mock backend

const API_BASE = "/api/mock"

interface FetchOptions {
  params?: Record<string, string>
  method?: "GET" | "POST"
  body?: any
}

async function fetchFromAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, method = "GET", body } = options

  let url = `${API_BASE}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// API de Máquinas
export const machinesAPI = {
  getAll: (filters?: { status?: string; location?: string; type?: string }) =>
    fetchFromAPI<{ data: any[]; total: number }>("/machines", { params: filters as any }),

  getById: (id: string) => fetchFromAPI<any>("", { params: { resource: "machines", id } }),
}

// API de Localizações
export const locationsAPI = {
  getAll: (type?: string) =>
    fetchFromAPI<{ data: any[]; total: number }>("/locations", { params: type ? { type } : undefined }),

  getById: (id: string) => fetchFromAPI<any>("/locations", { params: { id } }),
}

// API de Funcionários
export const employeesAPI = {
  getAll: (filters?: { department?: string; status?: string; team?: string }) =>
    fetchFromAPI<{ data: any[]; total: number }>("/employees", { params: filters as any }),
}

// API de Tarefas
export const tasksAPI = {
  getAll: () => fetchFromAPI<{ data: any; counts: any }>("/tasks"),

  getByStatus: (status: string, priority?: string) =>
    fetchFromAPI<{ data: any[]; total: number }>("/tasks", {
      params: { status, ...(priority && { priority }) },
    }),
}

// API de Relatórios
export const reportsAPI = {
  getMachineReports: (machineId?: string) =>
    fetchFromAPI<{ data: any[]; total: number }>("/reports", {
      params: { type: "machine", ...(machineId && { machineId }) },
    }),

  getMetricsReports: () => fetchFromAPI<{ data: any[]; total: number }>("/reports", { params: { type: "metrics" } }),
}

// API de Equipe
export const teamAPI = {
  getMetrics: (period?: "30days" | "3months" | "6months") =>
    fetchFromAPI<any>("/team", { params: period ? { period } : undefined }),
}

// API de Fornecedores
export const vendorsAPI = {
  search: (partName: string, maxDistance?: number) =>
    fetchFromAPI<{ data: any[]; total: number }>("/vendors", {
      params: { partName, ...(maxDistance && { maxDistance: String(maxDistance) }) },
    }),
}

// API Bedrock AI
export const bedrockAPI = {
  getConfig: () => fetchFromAPI<{ data: any }>("/bedrock"),

  getResource: (resource: string) => fetchFromAPI<{ data: any }>("/bedrock", { params: { resource } }),

  analyzeMachine: (machineId: string, analysisType?: string) =>
    fetchFromAPI<any>("/bedrock", {
      method: "POST",
      body: { machineId, analysisType },
    }),
}

// API genérica para recursos
export const genericAPI = {
  get: <T>(resource: string, id?: string) =>
    fetchFromAPI<T>("/\" + resource, { params: id ? { id } : undefined }),\
}
