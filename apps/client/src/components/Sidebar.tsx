import axios from "axios";
import { useState, useEffect } from "react";
import { PiSidebarSimpleDuotone } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../lib/config";
import { SidebarExecutionCard } from "./SidebarExecutionCard";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const [executions, setExecutions] = useState([]);
  const [loadingExecutions, setLoadingExecutions] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    navigate("/");
  }

  const fetchAllExecutions = async () => {
    setLoadingExecutions(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/execute/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const mapped = res.data.executions.map((e: any) => ({
          id: e.id,
          status: e.status,
          startedAt: e.startedAt,
          endedAt: e.endedAt,
          workflow: {
            id: e.workflow.id,
            title: e.workflow.title,
          },
        }));

        setExecutions(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExecutions(false);
    }
  };

  useEffect(() => {
    fetchAllExecutions();
  }, []);

  return (
    <div
      className={`bg-zinc-200/40 h-[calc(100vh-3.5rem)] mt-14 duration-300 flex flex-col
      ${open ? "w-64" : "w-12"}`}
    >
      {/* HEADER */}
      <div className="flex justify-between h-10">
        <div className={`${open ? "block" : "hidden"} m-2 font-vietnam text-floral/75`}>
          Overview
        </div>

        <button onClick={() => setOpen(!open)}>
          <PiSidebarSimpleDuotone className="size-6 m-3 text-floral/80" />
        </button>
      </div>

      {/* DASHBOARD BUTTON */}
      <div className={`${open ? "block" : "hidden"} mt-6 ml-3 mr-3`}>
        <button
          className="grad-button bg-corporateBlue text-white p-2 rounded-sm font-vietnam w-full"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </div>

      {/* MINI EXECUTION CARDS */}
      <div className={`flex-1 overflow-y-auto mt-8 mb-4 border rounded-sm border-slate-300/40 mr-1 ml-1  px-2 ${open ? "block" : "hidden"}`}>
        {loadingExecutions ? (
          <div className="text-center text-[11px] text-gray-500 p-4">Loading…</div>
        ) : executions.length === 0 ? (
          <div className="text-center text-[11px] text-gray-500">No executions yet</div>
        ) : (
          executions.map((exec) => (
            <SidebarExecutionCard key={exec.id} exec={exec} />
          ))
        )}
      </div>

      {/* LOGOUT BUTTON */}
      <div className={`${open ? "block" : "hidden"} m-2 mb-5`}>
        <button className="p-2 rounded-sm font-vietnam w-full grad-button" onClick={logout}>
          <div className="flex items-center justify-center">
            <TbLogout2 className="mr-2 -ml-1.5" /> Logout
          </div>
        </button>
      </div>
    </div>
  );
}
