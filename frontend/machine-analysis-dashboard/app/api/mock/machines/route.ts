import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const location = searchParams.get("location")
  const type = searchParams.get("type")

  await new Promise((resolve) => setTimeout(resolve, 100))

  let machines = mockData.machines

  if (status) {
    machines = machines.filter((m) => m.status === status)
  }

  if (location) {
    machines = machines.filter((m) => m.location.toLowerCase().includes(location.toLowerCase()))
  }

  if (type) {
    machines = machines.filter((m) => m.type === type)
  }

  return NextResponse.json({
    data: machines,
    total: machines.length,
    timestamp: new Date().toISOString(),
  })
}
