import { useState } from "react"
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegWindowClose } from "react-icons/fa";

export function Sidepanel({ onAddNode, openPicker }:{ onAddNode: (type: string) => void; openPicker?: (mode: "trigger" | "action") => void }) {

    const [open, setOpen] = useState(false);

    const trigger = [
        { label: "Manual trigger", type: "manual" },
        { label: "Webhook trigger", type: "webhook" }
    ]

    const nodes = [
        { label: "Telegram", type: "telegram" },
        { label: "Resend", type: "resend" },
        { label: "Gemini", type: "gemini"}
    ]

    return (
        <div className={`bg-sdbar h-[calc(100vh-3.5rem)] mt-14 duration-300 fixed right-0
        ${open ? "w-64" : "w-12"}`}>
            <div className="flex items-center justify-between h-10">
                <button onClick={() => setOpen(!open)}>
                    <FaRegSquarePlus className="size-6 m-3 text-floral/80" />
                </button>
                {open && (
                    <button onClick={() => setOpen(false)}>
                        <FaRegWindowClose className="size-5 m-3 text-floral/80 " />
                    </button>
                )}
            </div>
            <div className={`p-3 space-y-4 ${open ? "block" : "hidden"}`}>
                {/* TRIGGER SECTION */}
                <div>
                    <div className="shadow-amber-50 rounded-md p-2 mb-2 ">
                        <h2 className="text-white text-2xl font-semibold p-2 mb-3 text-center">
                            Add Triggers
                        </h2>
                        <div className="space-y-4">
                            {trigger.map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => onAddNode(item.type)}
                                    className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl p-3 w-full text-white font-semibold
                                               hover:scale-98 transition-transform ease-in-out cursor-pointer shadow shadow-black/75">
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            
            {/* Nodes Section */}
            <div className="shadow-amber-50 rounded-md p-2 mb-2">

              <h2 className="text-white text-2xl font-semibold p-2 mb-3 text-center">
                Add Nodes
              </h2>
                <div className="space-y-4">
                    {nodes.map((item) => (
                        <button key={item.type}
                        onClick={() => onAddNode(item.type)}
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl p-3 w-full text-white font-semibold
                                               hover:scale-98 transition-transform ease-in-out cursor-pointer shadow shadow-black/75">                            
                        {item.label}
                        </button>
                    ))}
                </div>
            </div>
            </div>
            </div>
    )
}
