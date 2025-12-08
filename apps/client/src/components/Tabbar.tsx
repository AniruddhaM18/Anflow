import logo from "../assets/logo.png"
import { Button } from "./ui/button"
export function Tabbar(){
    return<div className="flex justify-normal bg-zinc-50 fixed w-screen h-14">
        <div className="ml-2 mt-2 bg-transparent">
        <img src={logo} alt="logo" width={60} height={60} className="w-[60] h-auto -mt-2 -ml-2"></img>
        </div>
        <div className="flex ml-auto">
              <Button  className=" grad-button bg-corporateBlue text-white p-4 rounded-sm mt-3 mb-3 mr-3 ml-2 hover:bg-corporateBlue font-vietnam ">
            Workflow Editor
          </Button>

        </div>
    </div>
}
//bg-gradient-to-r from-indigo-950/75 to-violet-600 
//bg-gradient-to-r from-red-400/75 to-violet-600