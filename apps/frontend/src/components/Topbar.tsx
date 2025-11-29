import { FaChevronDown } from "react-icons/fa6";
import finalLogo from "../assets/finalLogo.png"
import { SignupForm } from "./signup-form";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { SigninForm } from "./signin-form";


export default function Topbar(){
    const [form, setForm] = useState(false);
    const [mode, setMode] = useState<"signup" | "signin">("signup");


    return <div >
        <div className="bg-black/60 flex justify-items-normal min-w-screen h-16">
            <div className="ml-2 mt-2 bg-transparent">
            <img src={finalLogo} alt="logo" width={180} height={80} className="w-[130px] h-auto -mt-1.5"></img>
            </div>
            <div className="flex items-center ml-8 mr-2">
            <h3 className="text-neutral-200/90 hover:text-white hover:font-semibold">Product</h3>
             <FaChevronDown className="text-neutral-200 mt-1 size-3.5 ml-1"/>           
            </div>
            <div className="flex items-center m-4">
            <h3 className="text-neutral-200/90  hover:text-white hover:font-semibold">Use Cases</h3>
             <FaChevronDown className="text-neutral-200 mt-1 size-3.5 ml-1"/>           
            </div>
            <div className="flex items-center m-4">
            <h3 className="text-neutral-200/90  hover:text-white hover:font-semibold">Docs</h3>
             <FaChevronDown className="text-neutral-200 mt-1 size-3.5 ml-1" />           
            </div>
            <div className="flex items-center m-4">
            <h3 className="text-neutral-200/90 hover:text-white hover:font-semibold">Community</h3>
             <FaChevronDown className="text-neutral-200 mt-1 size-3.5 ml-1" />           
            </div> 
            <div className="flex items-center m-4">
            <h3 className="text-neutral-200/90  hover:text-white hover:font-semibold">Enterprise</h3>
            </div>
            <div className="flex items-center m-4">
            <h3 className="text-neutral-200/90  hover:text-white hover:font-semibold">Pricing</h3>
            </div>
             <div className="flex ml-auto mr-4 mt-2">
                <button className="bg-gradient-to-r from-indigo-600 to-violet-500 rounded-md px-4 py-2 m-2 text-white/80 font-semibold
                hover:scale-98 transition-transform ease-in-out cursor-pointer" 
                onClick={() => {
                    setMode("signup");
                    setForm(true);
                }}>Get Started</button>

                <button className="bg-gradient-to-r from-violet-600/80 to-indigo-600/90  rounded-md px-4 py-2 m-2 text-neutral-50 font-semibold 
                hover:scale-98 transition-transform ease-in-out cursor-pointer" 
                onClick={() => {
                    setMode("signin");
                    setForm(true);
                }}>Signin</button>
                <Dialog open={form} onOpenChange={setForm}>
                    <DialogContent className="max-w-md">
                        {mode === "signup" ? <SignupForm /> : <SigninForm />}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </div>
}