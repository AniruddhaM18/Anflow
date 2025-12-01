import logo from "../assets/logo.png";
import logobg from "../assets/logobg.png";
import SignupPage from "../pages/Signup";
import { SignupForm } from "./signup-form";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";


export function Topbar() {
    const navigate = useNavigate();
    return <div className="flex justify-between mx-auto">
        <div className="flex items-center">
        <div className="size-16 m-1">
            <img src={logo} alt="logo"></img>
        </div>
        <h1 className="font-vietnam text-3xl text-black font-regular mt-1.5">
            Anflow
        </h1>
        </div>

        <div className="flex gap-3 mr-2">
            <Button className="text-neutral-600 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-700 mt-6 font-vietnam font-normal py-2 rounded-sm text-md"
            onClick={() => navigate("/signin")}>Login</Button>
            <Button className="text-pureWhite bg-corporateBlue hover:bg-corporateBlue/95 hover:text-neutral-100 mt-6 font-vietnam rounded-sm text-md mr-3 py-2"
            onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
    </div>
}