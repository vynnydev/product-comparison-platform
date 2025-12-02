import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")
  const id = searchParams.get("id")

  // Simular latência de API real
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!resource) {
    return NextResponse.json(
      {
        error: "Resource parameter is required",
        availableResources: [
          "machines",
          "locations",
          "employees",
          "teamMembers",
          "teamMetrics",
          "teamDistribution",
          "projects",
          "tasks",
          "reports",
          "inventory",
          "workshops",
          "bedrockAI",
          "partsVendors",
        ],
      },
      { status: 400 },
    )
  }

  const data = (mockData as Record<string, any>)[resource]

  if (!data) {
    return NextResponse.json({ error: `Resource '${resource}' not found` }, { status: 404 })
  }

  // Se um ID específico foi solicitado
  if (id && Array.isArray(data)) {
    const item = data.find((item: any) => item.id === id)
    if (!item) {
      return NextResponse.json({ error: `Item with id '${id}' not found` }, { status: 404 })
    }
    return NextResponse.json(item)
  }

  return NextResponse.json(data)
}
