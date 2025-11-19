import { Position, Handle } from '@xyflow/react';

import { PiWebhooksLogoDuotone } from "react-icons/pi";

export function WebhookTrigger() {
    return <div className="relative bg-gradient-to-r from-indigo-950/75 to-violet-600 border border-neutral-100 
    rounded-tl-3xl rounded-bl-3xl rounded-tr-md rounded-br-md
    flex items-center justify-center size-12">
        <PiWebhooksLogoDuotone className="size-7 text-white pl-1" />
        <Handle type="source" position={Position.Right} />
    </div>
}
