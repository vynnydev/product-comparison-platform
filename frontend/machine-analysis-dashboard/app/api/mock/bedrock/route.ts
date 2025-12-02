import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

// Simula resposta da IA Bedrock para configuração 3D
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")

  await new Promise((resolve) => setTimeout(resolve, 150))

  const bedrockData = mockData.bedrockAI

  if (!resource) {
    return NextResponse.json({
      data: bedrockData,
      timestamp: new Date().toISOString(),
      source: "bedrock-ai-mock",
    })
  }

  const resourceData = (bedrockData as Record<string, any>)[resource]

  if (!resourceData) {
    return NextResponse.json(
      {
        error: `Resource '${resource}' not found`,
        availableResources: Object.keys(bedrockData),
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    data: resourceData,
    timestamp: new Date().toISOString(),
    source: "bedrock-ai-mock",
  })
}

// Simula análise da IA Bedrock para uma máquina específica
export async function POST(request: Request) {
  const body = await request.json()
  const { machineId, analysisType } = body

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simula uma resposta de análise da IA
  const analysisResponse = {
    machineId,
    analysisType: analysisType || "health-check",
    timestamp: new Date().toISOString(),
    confidence: 0.94,
    results: {
      healthScore: Math.floor(Math.random() * 20) + 80,
      riskLevel: "low",
      predictedFailure: null,
      recommendations: [
        "Manter cronograma de manutenção preventiva",
        "Verificar níveis de lubrificação mensalmente",
        "Próxima inspeção recomendada em 30 dias",
      ],
      anomalies: [],
      trends: {
        temperature: "stable",
        vibration: "stable",
        efficiency: "improving",
      },
    },
    render3DConfig: {
      statusIndicator: {
        color: "#10b981",
        intensity: 2.5,
        animation: "pulse",
      },
      highlights: [],
      overlays: [],
    },
    source: "bedrock-ai-mock",
  }

  return NextResponse.json(analysisResponse)
}
