import { Position, Handle } from '@xyflow/react';
import resendIcon from "../../assets/resendIcon.svg"
export function ResendNode() {
    return <div className="relative bg-gray-100 border border-neutral-500  
    rounded-md flex items-center justify-center size-12">
    <Handle type="target" position={Position.Left} />
    <img src={resendIcon} alt="logo" width={180} height={80} className="w-[130px] h-auto"></img>
    <Handle type="source" position={Position.Right} />
    </div>
}