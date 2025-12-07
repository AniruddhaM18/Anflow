import { useState } from "react"
import { PiSidebarSimpleDuotone } from "react-icons/pi";

export function Sidebar(){
    const [open, setOpen] = useState(true);

    return<div className={`bg-zinc-200/40 h-[calc(100vh-3.5rem)]  mt-14 duration-300
    ${open ? "w-64" : "w-12"}`}>
        <div className="flex justify-between h-10">
        <div className={`${open ? "block" : "hidden"} m-2 text-floral/75 font-vietnam`}>
            Overview
        </div>
        <button onClick={() => setOpen(!open)}>
            <PiSidebarSimpleDuotone className="size-6 m-3 text-floral/80" />
        </button>
        </div >
        <div className={`${open ? "block" : "hidden"} m-2`}>

              <button className="gradient-button p-2 rounded-sm font-vietnam"> 
            Aniruddha
        </button>
        </div>
  
    </div>
}