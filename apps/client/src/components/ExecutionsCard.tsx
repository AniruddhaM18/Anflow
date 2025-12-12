import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ExecutionItem {
  id: string;
  status: "SUCCESS" | "FAILED" | "RUNNING" | "PENDING";
  startedAt: string;
  endedAt?: string | null;
  workflow: {
    id: string;
    title: string;
  };
}

interface ExecutionsCardsProps {
  executions: ExecutionItem[];
}

export function ExecutionsCards({ executions }: ExecutionsCardsProps) {
  const navigate = useNavigate();

  const statusVariant = (status: string) => {
    if (status === "SUCCESS") return "default" as const;
    if (status === "FAILED") return "destructive" as const;
    return "outline" as const;
  };

  const statusClassName = (status: string) => {
    if (status === "SUCCESS") return "bg-emeraldGreen text-white hover:bg-green-600";
    return "";
  };

  const formatWhen = (dateString?: string | null) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "—";
    }
  };

  const formatExecutionTime = (startTime: string, endTime?: string | null) => {
    if (!endTime) return "Running…";

    try {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const durationMs = end - start;

      if (isNaN(start) || isNaN(end)) return "—";

      if (durationMs < 1000) return `${durationMs}ms`;
      if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`;

      return `${(durationMs / 60000).toFixed(1)}m`;
    } catch {
      return "—";
    }
  };

  if (!executions || executions.length === 0) {
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <div className="font-vietnam font-bold text-xl">No Executions Yet!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-7xl">
      {executions.map((exec) => (
        <Card key={exec.id} className="hover:shadow-md transition-shadow font-vietnam">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge
                  variant={statusVariant(exec.status)}
                  className={`font-vietnam uppercase rounded-sm ${statusClassName(exec.status)}`}
                >
                  {exec.status}
                </Badge>

                <button
                  onClick={() => navigate(`/workflows/${exec.workflow.id}`)}
                  className="text-left truncate hover:underline font-semibold"
                >
                  {exec.workflow.title}
                </button>
              </div>

              <div className="text-sm text-muted-foreground whitespace-nowrap">
                Started {formatWhen(exec.startedAt)}
              </div>

              <div className="text-sm font-medium whitespace-nowrap">
                {formatExecutionTime(exec.startedAt, exec.endedAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ExecutionsCards;
