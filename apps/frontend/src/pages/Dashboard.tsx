import { DashBar } from "@/components/DashBar";

export function DashboardPage() {
    return <div className="outer-container h-screen w-screen">
        <div className="absolute inset-0 bg-neutral-950/75">
            <div className="relative z-10">
            <DashBar />
            </div>
        </div>
    </div>
}