import { Sidebar } from "../components/Sidebar";
import { Tabbar } from "../components/Tabbar";
import { FlowPage } from "./Flow";

export function Dashboard() {
  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-200/40">

      {/* TOP BAR */}
      <Tabbar />

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT (FlowPage) */}
        <div className="flex-1 overflow-auto p-1">
          <FlowPage />
        </div>

      </div>
    </div>
  );
}
