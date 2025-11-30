import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-all">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[var(--bg)] transition-all">
        <div className="max-w-7xl mx-auto">

          {/* CHILD ROUTES ONLY */}
          <Outlet />

        </div>
      </main>

    </div>
  );
}
