import { Position, Handle } from '@xyflow/react';
import Image from 'next/image';

export function ResendNode() {
    return <div className="relative bg-slate-950 border border-neutral-500  
    rounded-md flex items-center justify-center size-12">
    <Handle type="target" position={Position.Left} />
    <Image src="/images/resendIcon.png" alt="logo" width={180} height={80} className="w-[130px] h-auto "/>
    <Handle type="source" position={Position.Right} />
    </div>
}