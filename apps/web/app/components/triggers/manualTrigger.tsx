import { Position, Handle } from '@xyflow/react';
import { HiMiniCursorArrowRipple } from "react-icons/hi2";

export function ManualTrigger() {
    return <div className="relative bg-gradient-to-r from-red-400/75 to-violet-600 border border-neutral-100 
    rounded-tl-3xl rounded-bl-3xl rounded-tr-md rounded-br-md
    flex items-center justify-center size-12">
        <HiMiniCursorArrowRipple className="size-8 text-white pl-1" />
        <Handle type="source" position={Position.Right} />
    </div>
}

//bg-gradient-to-r from-indigo-950/75 to-violet-600 
//bg-gradient-to-r from-red-400/75 to-violet-600