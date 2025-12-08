import { useState } from "react"
import { PiSidebarSimpleDuotone } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";

export function Sidebar(){
    const [open, setOpen] = useState(true);

    return<div className={`bg-zinc-200/40 h-[calc(100vh-3.5rem)]  mt-14 duration-300 flex flex-col
    ${open ? "w-64" : "w-12"}`}>
        <div className="flex justify-between h-10">
        <div className={`${open ? "block" : "hidden"} m-2 text-floral/75 font-vietnam`}>
            Overview
        </div>
        <button onClick={() => setOpen(!open)}>
            <PiSidebarSimpleDuotone className="size-6 m-3 text-floral/80" />
        </button>
        </div >
        <div className={`${open ? "block" : "hidden"} mt-6 ml-3 mr-3 flex flex-col gap-2 `}>
            <button className="grad-button bg-corporateBlue text-white p-2 rounded-sm font-vietnam w-full"> 
            Dashboard
            </button>
        </div>
        <div className={`${open ? "block" : "hidden"} m-2 mb-5 mt-auto`}>
                <button className="grad-button p-2 rounded-sm font-vietnam w-full">
                    <div className="flex items-center justify-center ">
                         <TbLogout2 className="mr-2 -ml-1.5" /> Logout
                    </div>
                </button>
            </div>
  
    </div>
}