import { Handle, Position } from "@xyflow/react";
import { MousePointer, Webhook ,Bot, Brain, Wrench, Loader2, CheckCircle2, XCircle } from "lucide-react"
import telegram from "../assets/telegramIcon.png"

import resend from "../assets/resendIcon.svg"


export const TriggerNode = ({data} :{data: any}) => {
  const status = data.__status as ("IDLE"|"RUNNING"|"SUCCESS"|"FAILED") | undefined;
  const borderClass = status === "RUNNING" ? "border-blue-500" : status === "SUCCESS" ? "border-green-500" : status === "FAILED" ? "border-red-500" : "border-black dark:border-white";
  return (
    <div className={`relative flex items-center justify-center border ${borderClass} bg-slate-300 dark:bg-neutral-900 p-2 rounded-l-lg`}>
      {data.type === "manual-trigger" && <MousePointer  className="w-6 h-6 " />}
      {data.type === "webhook-trigger" && <Webhook className="w-6 h-6 text-orange-500" />}
      {status === "RUNNING" && <Loader2 className="w-4 h-4 ml-1 animate-spin text-blue-500" />}
      {status === "SUCCESS" && <CheckCircle2 className="w-4 h-4 ml-1 text-green-500" />}
      {status === "FAILED" && <XCircle className="w-4 h-4 ml-1 text-red-500" />}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export const ActionNode = ({data} :{data: any}) => {
    // console.log(data);
    const status = data.__status as ("IDLE"|"RUNNING"|"SUCCESS"|"FAILED") | undefined;
    const borderClass = status === "RUNNING" ? "border-blue-500" : status === "SUCCESS" ? "border-green-500" : status === "FAILED" ? "border-red-500" : "border-black dark:border-white";
    return (
      <div className={`flex items-center justify-center bg-neutral-50 rounded-md border ${borderClass} p-2 ${data.type === "agent" ? "w-28" : ""}`}>
        <Handle type="target" position={Position.Left} />
        {data.type === "telegram" && <img src={telegram} alt="telegram" className="w-6 h-6 " />}
        {data.type === "resend" && <img src={resend} alt="resend" className="w-6 h-6" />}
        {status === "RUNNING" && <Loader2 className="w-4 h-4 ml-1 animate-spin text-blue-500" />}
        {status === "SUCCESS" && <CheckCircle2 className="w-4 h-4 ml-1 text-green-500" />}
        {status === "FAILED" && <XCircle className="w-4 h-4 ml-1 text-red-500" />}
        <Handle type="source" position={Position.Right}/>
        {data.type === "agent" && <Handle type="source" position={Position.Bottom} id="model" className="!left-2">
          <div className="flex items-center justify-center w-2 h-5 ">
          <Brain size={16} />
          </div>
          </Handle>}
        {data.type === "agent" && <Handle type="source" position={Position.Bottom} id="tool" className="!right-5" >  <div className="flex items-center justify-center w-2 h-5 ">
          <Wrench size={16} />
          </div></Handle>}
      </div>
    )
}