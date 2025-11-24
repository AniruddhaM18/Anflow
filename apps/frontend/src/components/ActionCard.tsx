import { Card, CardContent } from "./ui/card";

import telegram from "../assets/telegramIcon.png"
import resend from "../assets/resendIcon.svg";
import gemini from "../assets/geminiIcon.png";
import { Bot } from "lucide-react";

export interface Action {
    id: string,
    name: string,
    type: string
}

interface ActionCardProps{
    action: Action,
    onSelect? : (action : Action) => void
}

const logos: Record<string, string> = {
    telegram,
    resend,
    gemini
}

export function ActionCard({action, onSelect} : ActionCardProps) {
    const logoSrc = logos[action.type];
    return(
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-violet-500 hover:border-l-violet-400"
        onClick={() => onSelect?.(action)}>
            <CardContent className="flex items-center gap-4">
                <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center overflow-hidden">
            {logoSrc ? (
              <img src={logoSrc} alt={action.name} className="h-8 w-8 object-contain" />
            ) : (
              <div className="text-sm font-kode font-bold text-orange-500">
                <Bot className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-kode font-semibold text-lg text-foreground mb-1">
              {action.name}
            </h3>
            <p className="font-inter text-muted-foreground text-sm leading-relaxed capitalize">
              {action.type}
            </p>
          </div>
        </div>
            </CardContent>

        </Card>
    )
}