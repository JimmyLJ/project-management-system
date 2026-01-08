import { Outlet } from "react-router-dom";
import Sidebar from "~/features/dashboard/Sidebar";
import Topbar from "~/features/dashboard/Topbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)]">
      <Sidebar />
      <main className="ml-64">
        <div className="px-10 py-6">
          <Topbar />
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
