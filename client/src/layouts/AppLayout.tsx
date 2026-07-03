import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import useUIStore from "../store/uiStore";
import { cn } from "../utils/cn";

const AppLayout = () => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* ---- Sidebar ---- */}
      <Sidebar />

      {/* ---- Main Area ---- */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        {/* ---- Topbar ---- */}
        <Topbar />

        {/* ---- Page Content ---- */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
