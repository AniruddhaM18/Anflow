import { useState } from "react"
import { PiSidebarSimpleDuotone } from "react-icons/pi";

export function DashBar(){
    const [open, setOpen] = useState(true);

    return<div className={`bg-sdbar/60 h-[calc(100vh-0.5rem)] duration-300 rounded-tr-2xl rounded-br-2xl my-0.5
    ${open ? "w-64" : "w-12"}`}>
        <div className="flex justify-between h-10">
        <div className={`${open ? "block" : "hidden"} m-2 text-floral/75`}>
            Overview
        </div>
        <button onClick={() => setOpen(!open)}>
            <PiSidebarSimpleDuotone className="size-6 m-3 text-floral/80" />
        </button>
        </div>
    </div>
}