import { Position, Handle } from '@xyflow/react';
import Image from 'next/image';

export function TelegramNode() {

    return <>
    <div className="relative bg-black border border-neutral-500  
    rounded-md p-2 flex items-center justify-center size-12">
    <Handle type="target" position={Position.Left} />
    <Image src="/images/telegramIcon.png" alt="logo" width={180} height={80} className="w-[130px] h-auto "/>
    <Handle type="source" position={Position.Right} />
    </div>
    </> 
}