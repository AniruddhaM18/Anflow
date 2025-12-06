import { Topbar } from "../components/Topbar";
import hero from "../assets/hero.png"
import { DockDemo } from "../components/Dock";

export function Landing() {
    return <div className="">
        <div className="">
              <Topbar />
        </div>
        <div>
            <div className="mt-10 w-[800px] mx-auto">
                <h1 className="font-vietnam text-3xl font-medium text-center">
                    The Fastest Way to Build AI Apps and Workflows 
                </h1>
                <h2 className="font-vietnam text-lg text-center font-thin mt-3">
                    Flexible AI workflow automation for technical teams
                </h2>
            </div>
            <div>
                <img src={hero} alt="hero" className="h-[450px] w-auto mx-auto mt-12 rounded-xl border-4 border-corporateBlue/80 ring-2 ring-slate-500/15 shadow-lg"></img>
            </div>
        </div>
        <div className="mt-4">
            <DockDemo />
        </div>
    </div>
    //pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl leading-none font-semibold whitespace-pre-wrap text-transparent
}