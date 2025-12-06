import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"

interface ExecutionItem {
  id: string
  status: "SUCCESS" | "FAILED" | "RUNNING" | string
  started_at: string
  ended_at?: string
  workflow: {
    id: string
    name: string
  }
}

interface ExecutionsCardsProps {
  executions: ExecutionItem[]
}

export function ExecutionsCards({ executions }: ExecutionsCardsProps) {
  const navigate = useNavigate()

  const statusVariant = (status: string) => {
    if (status === "SUCCESS") return "default" as const
    if (status === "FAILED") return "destructive" as const
    return "outline" as const
  }

  const statusClassName = (status: string) => {
    if (status === "SUCCESS") return "bg-green-500 text-white hover:bg-green-600"
    return ""
  }

  const formatWhen = (dateString?: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const formatExecutionTime = (startTime: string, endTime?: string) => {
    if (!endTime) return "—"
    
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMs = end - start
    
    if (durationMs < 1000) {
      return `${durationMs}ms`
    } else if (durationMs < 60000) {
      return `${(durationMs / 1000).toFixed(1)}s`
    } else {
      return `${(durationMs / 60000).toFixed(1)}m`
    }
  }

  if (!executions || executions.length === 0) {
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <div className="font-kode font-bold text-xl">No Executions Yet!</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-7xl">
      {(executions || []).map((exec) => (
        <Card key={exec.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge 
                  variant={statusVariant(exec.status)} 
                  className={`font-inter uppercase ${statusClassName(exec.status)}`}
                >
                  {exec.status}
                </Badge>
                <button
                  onClick={() => navigate(`/workflows/${exec.workflow.id}`)}
                  className="text-left truncate hover:underline font-semibold"
                >
                  {exec.workflow.name}
                </button>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                Started {formatWhen(exec.started_at)}
                {/* {exec.ended_at ? ` • Ended ${formatWhen(exec.ended_at)}` : ""} */}
              </div>
              <div>
              {exec.ended_at && (
                  <span className="ml-2 font-medium">
                    Time duration : {formatExecutionTime(exec.started_at, exec.ended_at)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ExecutionsCards

