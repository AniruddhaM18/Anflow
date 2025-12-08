import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // No token needed — cookie already set by backend
        navigate("/dashboard");
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <p>Logging you in...</p>
        </div>
    );
}
