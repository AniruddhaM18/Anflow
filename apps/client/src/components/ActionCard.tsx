import { Card, CardContent } from "./ui/card"
import telegram from "../assets/telegramIcon.png"
import resend from "../assets/resendIcon.svg"
import { Bot, BetweenHorizontalStart } from "lucide-react"

export interface Action {
  id: string
  name: string
  type: string
}

interface ActionCardProps {
  action: Action
  onSelect?: (action: Action) => void
}

const logos: Record<string, string> = {
  telegram,
  resend,
}

export function ActionCard({ action, onSelect }: ActionCardProps) {
  const logoSrc = logos[action.type]

  return (
    <Card
      className="hover:shadow-md font-vietnam transition-all bg-zinc-100 duration-200 cursor-pointer border-4 border-zinc-200 hover:border-corporateBlue/25"
      onClick={() => onSelect?.(action)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center overflow-hidden">
            {logoSrc ? (
              <img src={logoSrc} alt={action.name} className="h-8 w-8 object-contain" />
            ) : (
              <div className="text-sm font-vietnam font-bold text-corporateBlue">
                <Bot className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-vietnam font-semibold text-lg text-foreground mb-1">
              {action.name}
            </h3>
            <p className="font-vietnam text-muted-foreground text-sm leading-relaxed capitalize">
              {action.type}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

