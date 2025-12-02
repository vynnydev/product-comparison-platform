import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const department = searchParams.get("department")
  const status = searchParams.get("status")
  const team = searchParams.get("team")

  await new Promise((resolve) => setTimeout(resolve, 100))

  let employees = mockData.employees

  if (department && department !== "all") {
    employees = employees.filter((e) => e.department === department)
  }

  if (status && status !== "all") {
    employees = employees.filter((e) => e.status === status)
  }

  if (team) {
    employees = employees.filter((e) => e.team === team)
  }

  return NextResponse.json({
    data: employees,
    total: employees.length,
    timestamp: new Date().toISOString(),
  })
}
