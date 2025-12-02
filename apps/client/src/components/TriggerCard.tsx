import { MousePointerClick, Webhook, Zap } from "lucide-react"
import { Card, CardContent } from "./ui/card"

export interface Trigger {
  id: string
  name: string
  type: string
  description: string
}

interface TriggerCardProps {
  trigger: Trigger
  onSelect?: (trigger: Trigger) => void
}

const getTriggerIcon = (type: string) => {
  switch (type) {
    case "manual-trigger":
      return <MousePointerClick className="size-8 text-violetPurple" />
    case "webhook-trigger":
      return <Webhook className="w-6 h-6 text-violetPurple" />
    default:
      return <Zap className="w-6 h-6 text-violetPurple" />
  }
}

const getTriggerDisplayName = (name: string, type: string) => {
  if (type === "webhook-trigger") {
    return (
      <span className="flex items-center gap-2">
        {name} <span className="text-violetPurple"></span>
      </span>
    )
  }
  return name
}

export function TriggerCard({ trigger, onSelect }: TriggerCardProps) {
  return (
    <Card className=" bg-slate-200/90 hover:shadow-sm transition-all duration-200 cursor-pointer p-3 rounded-md border-4 border-slate-100/50 shadow-black/20 
                ring-1 ring-white/5" 
    onClick={() => onSelect?.(trigger)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getTriggerIcon(trigger.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-vietnam text-zinc-700 font-semibold text-lg text-foreground mb-2">
              {getTriggerDisplayName(trigger.name, trigger.type)}
            </h3>
            <p className="font-vietnam text-muted-foreground text-sm leading-relaxed">
              {trigger.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}