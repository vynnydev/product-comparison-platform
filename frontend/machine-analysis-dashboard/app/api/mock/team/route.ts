import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") as "30days" | "3months" | "6months" | null

  await new Promise((resolve) => setTimeout(resolve, 100))

  const response: any = {
    members: mockData.teamMembers,
    distribution: mockData.teamDistribution,
    timestamp: new Date().toISOString(),
  }

  if (period && mockData.teamMetrics[period]) {
    response.metrics = mockData.teamMetrics[period]
  } else {
    response.metrics = mockData.teamMetrics
  }

  return NextResponse.json(response)
}
