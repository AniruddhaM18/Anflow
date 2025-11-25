import Topbar from "../components/Topbar";
import demo2 from "../assets/demo2.png";

export function HomePage(){
    return<div className="outer-container h-screen w-screen flex flex-col">
        <Topbar />
        <div>
            <h1 className="text-4xl font-semibold text-neutral-200 text-center mt-20 font-geomanist drop-shadow-sm drop-shadow-white/45">
                Flexible AI workflow automation</h1>
            <h3 className="text-md text-neutral-300 text-center font-mono mt-4"> 
                Build with the precision of code or the speed of drag-n-drop. <br />
                Host with on-prem control or in-the-cloud convenience.
            </h3>
        </div>
        <div className="aspect-video w-full max-w-[800px] mx-auto mt-auto mb-14 border-8 border-neutral-400/75 rounded-lg ">
            <img className="w-full h-full"src={demo2}></img>
        </div>
    </div>
}