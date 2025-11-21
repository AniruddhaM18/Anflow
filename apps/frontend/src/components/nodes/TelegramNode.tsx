import { Position, Handle } from '@xyflow/react';
import telegramIcon from "../../assets/telegramIcon.png"
export function TelegramNode() {
    return <div className="relative bg-gray-100 border border-neutral-500  
    rounded-md flex items-center justify-center size-12">
    <Handle type="target" position={Position.Left} />
    <img src={telegramIcon} alt="logo" width={180} height={80} className="w-[130px] h-auto p-2"></img>
    <Handle type="source" position={Position.Right} />
    </div>
}