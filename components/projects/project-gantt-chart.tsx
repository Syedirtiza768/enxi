"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { format, addDays, differenceInDays, startOfMonth, endOfMonth } from "date-fns"

// Mock data
const tasks = [
  {
    id: "TASK-001",
    title: "Project Planning",
    startDate: "2023-07-01",
    endDate: "2023-07-07",
    progress: 100,
    dependencies: [],
  },
  {
    id: "TASK-002",
    title: "Requirements Gathering",
    startDate: "2023-07-03",
    endDate: "2023-07-10",
    progress: 100,
    dependencies: ["TASK-001"],
  },
  {
    id: "TASK-003",
    title: "Design Phase",
    startDate: "2023-07-10",
    endDate: "2023-07-20",
    progress: 70,
    dependencies: ["TASK-002"],
  },
  {
    id: "TASK-004",
    title: "Development - Frontend",
    startDate: "2023-07-15",
    endDate: "2023-07-30",
    progress: 40,
    dependencies: ["TASK-003"],
  },
  {
    id: "TASK-005",
    title: "Development - Backend",
    startDate: "2023-07-15",
    endDate: "2023-07-30",
    progress: 35,
    dependencies: ["TASK-003"],
  },
  {
    id: "TASK-006",
    title: "Testing",
    startDate: "2023-07-25",
    endDate: "2023-08-05",
    progress: 0,
    dependencies: ["TASK-004", "TASK-005"],
  },
  {
    id: "TASK-007",
    title: "Deployment",
    startDate: "2023-08-05",
    endDate: "2023-08-10",
    progress: 0,
    dependencies: ["TASK-006"],
  },
]

export function ProjectGanttChart() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Calculate the start and end dates for the current month view
  const startDate = startOfMonth(currentMonth)
  const endDate = endOfMonth(currentMonth)

  // Generate days for the header
  const days = []
  let currentDay = startDate
  while (currentDay <= endDate) {
    days.push(currentDay)
    currentDay = addDays(currentDay, 1)
  }

  // Calculate the position and width of each task bar
  const getTaskBarStyle = (task: any) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    // Calculate the position relative to the visible range
    const startOffset = Math.max(0, differenceInDays(taskStart, startDate))
    const width = Math.min(differenceInDays(endDate, taskStart) + 1, differenceInDays(taskEnd, taskStart) + 1)

    return {
      gridColumnStart: startOffset + 1,
      gridColumnEnd: `span ${width}`,
      backgroundColor: getProgressColor(task.progress),
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "var(--success)"
    if (progress > 0) return "var(--primary)"
    return "var(--muted)"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex mb-2">
          <div className="w-48 flex-shrink-0 pr-4 font-medium">Task</div>
          <div className="flex-grow grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(30px, 1fr))` }}>
            {days.map((day, index) => (
              <div
                key={index}
                className={`text-center text-xs py-1 ${day.getDay() === 0 || day.getDay() === 6 ? "bg-muted/50" : ""}`}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>

        {tasks.map((task) => (
          <div key={task.id} className="flex mb-2">
            <div className="w-48 flex-shrink-0 pr-4">
              <div className="text-sm font-medium">{task.title}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(task.startDate), "MMM d")} - {format(new Date(task.endDate), "MMM d")}
              </div>
            </div>
            <div
              className="flex-grow grid relative"
              style={{ gridTemplateColumns: `repeat(${days.length}, minmax(30px, 1fr))` }}
            >
              {/* Weekend highlights */}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`border-r border-border ${day.getDay() === 0 || day.getDay() === 6 ? "bg-muted/50" : ""}`}
                ></div>
              ))}

              {/* Task bar */}
              <div
                className="absolute top-1 h-6 rounded-sm flex items-center justify-center text-xs text-white px-2"
                style={getTaskBarStyle(task)}
              >
                {task.progress > 0 && (
                  <Badge variant="outline" className="bg-background text-foreground text-[10px] h-4">
                    {task.progress}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
