import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")

  await new Promise((resolve) => setTimeout(resolve, 100))

  const tasks = mockData.tasks

  if (status) {
    const statusMap: Record<string, keyof typeof tasks> = {
      todo: "todo",
      "in-progress": "inProgress",
      review: "review",
      done: "done",
    }
    const key = statusMap[status]
    if (key) {
      let filteredTasks = tasks[key]
      if (priority && priority !== "all") {
        filteredTasks = filteredTasks.filter((t) => t.priority === priority)
      }
      return NextResponse.json({
        data: filteredTasks,
        total: filteredTasks.length,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Retornar todas as tarefas organizadas por status
  return NextResponse.json({
    data: tasks,
    counts: {
      todo: tasks.todo.length,
      inProgress: tasks.inProgress.length,
      review: tasks.review.length,
      done: tasks.done.length,
      total: tasks.todo.length + tasks.inProgress.length + tasks.review.length + tasks.done.length,
    },
    timestamp: new Date().toISOString(),
  })
}
