import { Position, Handle } from '@xyflow/react';
import geminiIcon from "../../assets/geminiIcon.png"
export function GeminiNode() {
    return <div className="relative bg-gray-100 border border-neutral-500  
    rounded-md flex items-center justify-center size-12">
    <Handle type="target" position={Position.Left} />
    <img src={geminiIcon} alt="logo" width={180} height={80} className="w-[130px] p-2 h-auto"></img>
    <Handle type="source" position={Position.Right} />
    </div>
}