export interface MachineData {
  id: string
  name: string
  model: string
  type?: string // Added type field to identify machine type
  status: "operational" | "warning" | "critical" | "maintenance"
  location: string
  lastMaintenance: string
  nextMaintenance: string
  efficiency: number
  metrics?: {
    temperature: number
    temperatureStatus: "normal" | "warning" | "critical"
    vibration: number
    vibrationStatus: "normal" | "warning" | "critical"
    pressure: number
    pressureStatus: "normal" | "warning" | "critical"
    runtime: number
    runtimeHours: number
  }
  parts: PartData[]
}

export interface PartData {
  id: string
  label: string
  name: string
  partNumber: string
  manufacturer: string
  status: "good" | "warning" | "critical"
  statusText: string
  recommendation: string
  position: { x: number; y: number }
  color: string
  lastMaintenance?: string
  lastReplacement?: string
  metrics?: {
    temperature?: number
    temperatureStatus?: "normal" | "warning" | "critical"
    vibration?: number
    vibrationStatus?: "normal" | "warning" | "critical"
    pressure?: number
    pressureStatus?: "normal" | "warning" | "critical"
    wear?: number
    wearStatus?: "normal" | "warning" | "critical"
  }
}

interface ApiMachineResponse {
  machine_id: string
  machine_name: string
  model: string
  location: string
  manufacturer: string
  status: string
}

function mapApiToMachineData(apiMachine: ApiMachineResponse): MachineData {
  // Normalize status
  const normalizedStatus = apiMachine.status.toLowerCase() as "operational" | "warning" | "critical" | "maintenance"

  // Detect machine type from model
  const machineType = detectMachineType(apiMachine.machine_name, apiMachine.model)

  // Generate default parts based on machine type
  const defaultParts = generateDefaultParts(machineType)

  return {
    id: apiMachine.machine_id,
    name: apiMachine.machine_name,
    model: apiMachine.model,
    type: machineType,
    status: normalizedStatus === "operational" ? "operational" : normalizedStatus,
    location: apiMachine.location,
    lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    nextMaintenance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 60 days from now
    efficiency: normalizedStatus === "operational" ? 94 : normalizedStatus === "warning" ? 75 : 45,
    metrics: {
      temperature: normalizedStatus === "operational" ? 65 : normalizedStatus === "warning" ? 85 : 105,
      temperatureStatus:
        normalizedStatus === "operational" ? "normal" : normalizedStatus === "warning" ? "warning" : "critical",
      vibration: normalizedStatus === "operational" ? 2.1 : normalizedStatus === "warning" ? 4.5 : 7.8,
      vibrationStatus:
        normalizedStatus === "operational" ? "normal" : normalizedStatus === "warning" ? "warning" : "critical",
      pressure: normalizedStatus === "operational" ? 8.5 : normalizedStatus === "warning" ? 10.2 : 12.8,
      pressureStatus:
        normalizedStatus === "operational" ? "normal" : normalizedStatus === "warning" ? "warning" : "critical",
      runtime: normalizedStatus === "operational" ? 156 : normalizedStatus === "warning" ? 220 : 310,
      runtimeHours: 3744,
    },
    parts: defaultParts,
  }
}

function generateDefaultParts(machineType: string): PartData[] {
  console.log("[v0] Gerando peças padrão para tipo:", machineType)

  const baseStatus = Math.random() > 0.7 ? "warning" : "good"
  const getRandomDate = (daysAgo: number) =>
    new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  switch (machineType) {
    case "car-engine":
      return [
        {
          id: "A",
          label: "A",
          name: "Bloco do Motor",
          partNumber: "ENG-001A",
          manufacturer: "AutoTech",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar óleo mensalmente",
          position: { x: 50, y: 50 },
          color: "#10b981",
          lastMaintenance: getRandomDate(15),
        },
        {
          id: "B",
          label: "B",
          name: "Turbocompressor",
          partNumber: "ENG-002B",
          manufacturer: "AutoTech",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation: baseStatus === "good" ? "Inspecionar trimestralmente" : "Substituir em 30 dias",
          position: { x: 65, y: 35 },
          color: baseStatus === "good" ? "#3b82f6" : "#f59e0b",
          lastMaintenance: getRandomDate(45),
          lastReplacement: getRandomDate(180),
        },
        {
          id: "C",
          label: "C",
          name: "Sistema de Injeção",
          partNumber: "ENG-003C",
          manufacturer: "AutoTech",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Limpar bicos injetores a cada 6 meses",
          position: { x: 40, y: 35 },
          color: "#8b5cf6",
          lastMaintenance: getRandomDate(30),
        },
        {
          id: "D",
          label: "D",
          name: "Sistema de Arrefecimento",
          partNumber: "ENG-004D",
          manufacturer: "AutoTech",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar nível de líquido semanalmente",
          position: { x: 35, y: 60 },
          color: "#06b6d4",
          lastMaintenance: getRandomDate(10),
        },
      ]

    case "mri-machine":
      return [
        {
          id: "A",
          label: "A",
          name: "Magneto Supercondutor",
          partNumber: "MRI-001A",
          manufacturer: "MedTech Solutions",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Monitorar temperatura criogênica diariamente",
          position: { x: 50, y: 50 },
          color: "#10b981",
          lastMaintenance: getRandomDate(20),
        },
        {
          id: "B",
          label: "B",
          name: "Bobinas de Gradiente",
          partNumber: "MRI-002B",
          manufacturer: "MedTech Solutions",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation:
            baseStatus === "good" ? "Calibrar anualmente" : "Recalibrar e verificar integridade",
          position: { x: 45, y: 65 },
          color: baseStatus === "good" ? "#3b82f6" : "#f59e0b",
          lastMaintenance: getRandomDate(60),
          lastReplacement: getRandomDate(365),
        },
        {
          id: "C",
          label: "C",
          name: "Sistema de RF",
          partNumber: "MRI-003C",
          manufacturer: "MedTech Solutions",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Testar transmissão mensalmente",
          position: { x: 60, y: 40 },
          color: "#8b5cf6",
          lastMaintenance: getRandomDate(25),
        },
        {
          id: "D",
          label: "D",
          name: "Sistema de Resfriamento",
          partNumber: "MRI-004D",
          manufacturer: "MedTech Solutions",
          status: "warning",
          statusText: "Atenção",
          recommendation: "Substituir hélio criogênico em breve",
          position: { x: 70, y: 55 },
          color: "#f59e0b",
          lastMaintenance: getRandomDate(90),
        },
      ]

    case "electric-bus":
      return [
        {
          id: "A",
          label: "A",
          name: "Bateria Principal",
          partNumber: "BUS-001A",
          manufacturer: "Volvo Energy",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Monitorar ciclos de carga diariamente",
          position: { x: 50, y: 70 },
          color: "#10b981",
          lastMaintenance: getRandomDate(7),
        },
        {
          id: "B",
          label: "B",
          name: "Motor Elétrico",
          partNumber: "BUS-002B",
          manufacturer: "Volvo Powertrain",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Lubrificar rolamentos trimestralmente",
          position: { x: 55, y: 50 },
          color: "#3b82f6",
          lastMaintenance: getRandomDate(15),
        },
        {
          id: "C",
          label: "C",
          name: "Sistema de Freios",
          partNumber: "BUS-003C",
          manufacturer: "Volvo Safety",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation: baseStatus === "good" ? "Verificar pastilhas mensalmente" : "Substituir pastilhas",
          position: { x: 40, y: 60 },
          color: baseStatus === "good" ? "#8b5cf6" : "#f59e0b",
          lastMaintenance: getRandomDate(20),
          lastReplacement: getRandomDate(120),
        },
        {
          id: "D",
          label: "D",
          name: "Sistema de Ar Condicionado",
          partNumber: "BUS-004D",
          manufacturer: "Volvo Comfort",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Limpar filtros mensalmente",
          position: { x: 50, y: 30 },
          color: "#06b6d4",
          lastMaintenance: getRandomDate(12),
        },
      ]

    case "industrial-washer":
      return [
        {
          id: "A",
          label: "A",
          name: "Tambor de Lavagem",
          partNumber: "WSH-001A",
          manufacturer: "IndustrialTech",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Limpar resíduos semanalmente",
          position: { x: 50, y: 50 },
          color: "#10b981",
          lastMaintenance: getRandomDate(10),
        },
        {
          id: "B",
          label: "B",
          name: "Sistema de Aquecimento",
          partNumber: "WSH-002B",
          manufacturer: "IndustrialTech",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation: baseStatus === "good" ? "Verificar resistências mensalmente" : "Substituir resistências",
          position: { x: 60, y: 65 },
          color: baseStatus === "good" ? "#3b82f6" : "#f59e0b",
          lastMaintenance: getRandomDate(35),
          lastReplacement: getRandomDate(240),
        },
        {
          id: "C",
          label: "C",
          name: "Bomba de Água",
          partNumber: "WSH-003C",
          manufacturer: "IndustrialTech",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar vedações trimestralmente",
          position: { x: 35, y: 55 },
          color: "#8b5cf6",
          lastMaintenance: getRandomDate(25),
        },
      ]

    case "centrifugal-pump":
      return [
        {
          id: "A",
          label: "A",
          name: "Caixa de Vedação",
          partNumber: "ZX92A4L",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar parafusos de fixação mensalmente",
          position: { x: 50, y: 20 },
          color: "#10b981",
          lastMaintenance: getRandomDate(15),
          metrics: {
            temperature: 55,
            temperatureStatus: "normal",
            vibration: 1.2,
            vibrationStatus: "normal",
            wear: 15,
            wearStatus: "normal",
          },
        },
        {
          id: "B",
          label: "B",
          name: "Eixo Principal",
          partNumber: "QP41D3M",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Lubrificar trimestralmente",
          position: { x: 35, y: 45 },
          color: "#3b82f6",
          lastMaintenance: getRandomDate(30),
          metrics: {
            temperature: 65,
            temperatureStatus: "normal",
            vibration: 2.3,
            vibrationStatus: "normal",
            wear: 20,
            wearStatus: "normal",
          },
        },
        {
          id: "C",
          label: "C",
          name: "Impelidor",
          partNumber: "RT85F6P",
          manufacturer: "Indústria Central",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation: baseStatus === "good" ? "Inspecionar semestralmente" : "Substituir em 30 dias",
          position: { x: 50, y: 50 },
          color: baseStatus === "good" ? "#10b981" : "#f59e0b",
          lastMaintenance: getRandomDate(45),
          lastReplacement: baseStatus === "warning" ? getRandomDate(180) : undefined,
          metrics: {
            temperature: baseStatus === "good" ? 70 : 95,
            temperatureStatus: baseStatus === "good" ? "normal" : "warning",
            vibration: baseStatus === "good" ? 3.1 : 5.8,
            vibrationStatus: baseStatus === "good" ? "normal" : "warning",
            wear: baseStatus === "good" ? 35 : 65,
            wearStatus: baseStatus === "good" ? "normal" : "warning",
          },
        },
        {
          id: "D",
          label: "D",
          name: "Carcaça Voluta",
          partNumber: "MN29H1W",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar integridade estrutural anualmente",
          position: { x: 65, y: 35 },
          color: "#8b5cf6",
          lastMaintenance: getRandomDate(20),
          metrics: {
            temperature: 60,
            temperatureStatus: "normal",
            vibration: 1.8,
            vibrationStatus: "normal",
            wear: 10,
            wearStatus: "normal",
          },
        },
        {
          id: "E",
          label: "E",
          name: "Flange de Saída",
          partNumber: "YL76K9Z",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar vedação mensalmente",
          position: { x: 80, y: 40 },
          color: "#06b6d4",
          lastMaintenance: getRandomDate(10),
          metrics: {
            temperature: 50,
            temperatureStatus: "normal",
            vibration: 0.9,
            vibrationStatus: "normal",
            wear: 5,
            wearStatus: "normal",
          },
        },
      ]

    default:
      return [
        {
          id: "A",
          label: "A",
          name: "Componente Principal",
          partNumber: "GEN-001A",
          manufacturer: "Indústria Central",
          status: baseStatus,
          statusText: baseStatus === "good" ? "Bom Estado" : "Atenção",
          recommendation: baseStatus === "good" ? "Verificar mensalmente" : "Agendar manutenção preventiva",
          position: { x: 50, y: 30 },
          color: baseStatus === "good" ? "#10b981" : "#f59e0b",
          lastMaintenance: getRandomDate(20),
          metrics: {
            temperature: baseStatus === "good" ? 55 : 85,
            temperatureStatus: baseStatus === "good" ? "normal" : "warning",
            vibration: baseStatus === "good" ? 1.2 : 4.5,
            vibrationStatus: baseStatus === "good" ? "normal" : "warning",
            pressure: baseStatus === "good" ? 7.8 : 10.5,
            pressureStatus: baseStatus === "good" ? "normal" : "warning",
            runtime: baseStatus === "good" ? 156 : 220,
            runtimeHours: 3744,
          },
        },
        {
          id: "B",
          label: "B",
          name: "Suporte Estrutural",
          partNumber: "GEN-002B",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Verificar fixação trimestralmente",
          position: { x: 40, y: 60 },
          color: "#3b82f6",
          lastMaintenance: getRandomDate(40),
        },
        {
          id: "C",
          label: "C",
          name: "Sistema de Controle",
          partNumber: "GEN-003C",
          manufacturer: "Indústria Central",
          status: "good",
          statusText: "Bom Estado",
          recommendation: "Testar funcionamento mensalmente",
          position: { x: 60, y: 50 },
          color: "#8b5cf6",
          lastMaintenance: getRandomDate(15),
        },
      ]
  }
}

const MOCK_MACHINES: MachineData[] = [
  {
    id: "machine-1",
    name: "Bomba Centrífuga BC-2000",
    model: "BC-2000",
    type: "centrifugal-pump",
    status: "operational",
    location: "Setor A - Linha 1",
    lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    efficiency: 94,
    metrics: {
      temperature: 65,
      temperatureStatus: "normal",
      vibration: 2.1,
      vibrationStatus: "normal",
      pressure: 8.5,
      pressureStatus: "normal",
      runtime: 156,
      runtimeHours: 3744,
    },
    parts: generateDefaultParts("centrifugal-pump"),
  },
  {
    id: "machine-2",
    name: "Motor V8 Turbo",
    model: "V8-4.0T",
    type: "car-engine",
    status: "operational",
    location: "Oficina Central",
    lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    efficiency: 91,
    metrics: {
      temperature: 72,
      temperatureStatus: "normal",
      vibration: 1.5,
      vibrationStatus: "normal",
      pressure: 9.2,
      pressureStatus: "normal",
      runtime: 120,
      runtimeHours: 2880,
    },
    parts: generateDefaultParts("car-engine"),
  },
  {
    id: "machine-3",
    name: "Ressonância Magnética MRI-3000",
    model: "MRI-3000",
    type: "mri-machine",
    status: "warning",
    location: "Hospital Central - Radiologia",
    lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    efficiency: 78,
    metrics: {
      temperature: 88,
      temperatureStatus: "warning",
      vibration: 4.2,
      vibrationStatus: "warning",
      pressure: 10.5,
      pressureStatus: "warning",
      runtime: 200,
      runtimeHours: 4800,
    },
    parts: generateDefaultParts("mri-machine"),
  },
  {
    id: "machine-4",
    name: "Ônibus Elétrico Volvo 7900",
    model: "7900-E",
    type: "electric-bus",
    status: "operational",
    location: "Garagem Norte",
    lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    efficiency: 96,
    metrics: {
      temperature: 58,
      temperatureStatus: "normal",
      vibration: 1.2,
      vibrationStatus: "normal",
      pressure: 7.5,
      pressureStatus: "normal",
      runtime: 95,
      runtimeHours: 2280,
    },
    parts: generateDefaultParts("electric-bus"),
  },
  {
    id: "machine-5",
    name: "Lavadora Industrial LW-5000",
    model: "LW-5000",
    type: "industrial-washer",
    status: "operational",
    location: "Lavanderia - Setor B",
    lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nextMaintenance: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    efficiency: 89,
    metrics: {
      temperature: 68,
      temperatureStatus: "normal",
      vibration: 2.8,
      vibrationStatus: "normal",
      pressure: 8.8,
      pressureStatus: "normal",
      runtime: 180,
      runtimeHours: 4320,
    },
    parts: generateDefaultParts("industrial-washer"),
  },
]

export async function fetchMachines(): Promise<MachineData[]> {
  try {
    const response = await fetch("https://nm55w7i9ug.execute-api.us-east-1.amazonaws.com/prod/machines/industry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`[v0] API retornou status ${response.status}`)
      console.log("[v0] Usando dados mockados (API indisponível)")
      return MOCK_MACHINES
    }

    const data = await response.json()
    console.log("[v0] Máquinas recebidas da API:", data)

    const apiMachines = Array.isArray(data) ? data : data.machines || []
    return apiMachines.map((apiMachine: ApiMachineResponse) => mapApiToMachineData(apiMachine))
  } catch (error) {
    console.error("[v0] Erro ao buscar máquinas da API:", error)
    console.log("[v0] Usando dados mockados (erro de rede)")
    return MOCK_MACHINES
  }
}

export async function fetchReviewMachines(): Promise<MachineData[]> {
  try {
    const response = await fetch("https://nm55w7i9ug.execute-api.us-east-1.amazonaws.com/prod/machines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`[v0] API retornou status ${response.status}`)
      console.log("[v0] Usando dados mockados para revisão (API indisponível)")
      return MOCK_MACHINES.filter((m) => m.status === "warning" || m.status === "critical")
    }

    const data = await response.json()
    console.log("[v0] Máquinas para revisão recebidas da API:", data)

    const apiMachines = Array.isArray(data) ? data : data.machines || []
    return apiMachines.map((apiMachine: ApiMachineResponse) => mapApiToMachineData(apiMachine))
  } catch (error) {
    console.error("[v0] Erro ao buscar máquinas para revisão:", error)
    console.log("[v0] Usando dados mockados para revisão (erro de rede)")
    return MOCK_MACHINES.filter((m) => m.status === "warning" || m.status === "critical")
  }
}

export async function fetchMachineById(id: string): Promise<MachineData | null> {
  try {
    const response = await fetch(`https://nm55w7i9ug.execute-api.us-east-1.amazonaws.com/prod/machines/${id}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.machine || data || null
  } catch (error) {
    console.error("[v0] Erro ao buscar máquina por ID:", error)
    return null
  }
}

export function detectMachineType(machineName: string, machineModel: string): string {
  const searchText = `${machineName} ${machineModel}`.toLowerCase()

  if (searchText.includes("bomba") || searchText.includes("pump") || searchText.includes("centrífuga")) {
    return "centrifugal-pump"
  }
  if (searchText.includes("compressor") || searchText.includes("ar") || searchText.includes("air")) {
    return "compressor"
  }
  if (searchText.includes("motor") || searchText.includes("elétrico") || searchText.includes("electric")) {
    return "electric-motor"
  }
  if (searchText.includes("válvula") || searchText.includes("valve")) {
    return "valve"
  }
  if (searchText.includes("rebitadeira") || searchText.includes("riveting") || searchText.includes("rebite")) {
    return "riveting-machine"
  }
  if (searchText.includes("montadora") || searchText.includes("assembly") || searchText.includes("automatizada")) {
    return "automated-assembly"
  }
  if (
    searchText.includes("cortadora") ||
    searchText.includes("cnc") ||
    searchText.includes("cutter") ||
    searchText.includes("corte")
  ) {
    return "cnc-cutter"
  }
  if (
    searchText.includes("prensa") ||
    searchText.includes("press") ||
    searchText.includes("hidráulica") ||
    searchText.includes("hydraulic")
  ) {
    return "hydraulic-press"
  }
  if (
    searchText.includes("soldadora") ||
    searchText.includes("solda") ||
    searchText.includes("welder") ||
    searchText.includes("robótica")
  ) {
    return "robotic-welder"
  }
  if (searchText.includes("furadeira") || searchText.includes("drill") || searchText.includes("fura")) {
    return "industrial-drill"
  }
  if (searchText.includes("motor v8") || searchText.includes("v8 turbo")) {
    return "car-engine"
  }
  if (searchText.includes("mri") || searchText.includes("ressonância magnética")) {
    return "mri-machine"
  }
  if (searchText.includes("ônibus elétrico") || searchText.includes("volvo 7900")) {
    return "electric-bus"
  }
  if (searchText.includes("lavadora industrial") || searchText.includes("lw-5000")) {
    return "industrial-washer"
  }

  // Default to centrifugal pump
  return "centrifugal-pump"
}

export interface RegisterRequest {
  name: string
  email: string
  username: string
  location_id: string
  password: string
}

export interface RegisterResponse {
  message: string
  user_id: string
  username: string
  email: string
  email_verification_required: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  user: {
    user_id: string
    username: string
    email: string
    name: string
    location_id: string
    email_verified: boolean
  }
}

const API_BASE_URL = "https://nm55w7i9ug.execute-api.us-east-1.amazonaws.com/prod"

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    console.log("[v0] Registering user:", { ...data, password: "***" })

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || errorData.error || `Erro no registro: ${response.status}`
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("[v0] Registration successful:", result)
    return result
  } catch (error) {
    console.error("[v0] Registration error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está disponível.")
    }
    throw error
  }
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    console.log("[v0] Logging in user:", data.username)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || errorData.error || `Erro no login: ${response.status}`
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("[v0] Login successful:", { ...result, access_token: "***", id_token: "***", refresh_token: "***" })
    return result
  } catch (error) {
    console.error("[v0] Login error:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está disponível.")
    }
    throw error
  }
}
