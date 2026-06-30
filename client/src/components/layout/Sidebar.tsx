import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, TrendingDown, Tag,
  Wallet, Target, Repeat, Calendar, BarChart3,
  Lightbulb, Settings, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import useUIStore from "../../store/uiStore";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import toast from "react-hot-toast";

// Navigation items with their icons and routes
const navItems = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.DASHBOARD },
    ],
  },
  {
    section: "Transactions",
    items: [
      { label: "Income", icon: TrendingUp, to: ROUTES.INCOME },
      { label: "Expenses", icon: TrendingDown, to: ROUTES.EXPENSES },
      { label: "Categories", icon: Tag, to: ROUTES.CATEGORIES },
    ],
  },
  {
    section: "Planning",
    items: [
      { label: "Budgets", icon: Wallet, to: ROUTES.BUDGETS },
      { label: "Goals", icon: Target, to: ROUTES.GOALS },
      { label: "Subscriptions", icon: Repeat, to: ROUTES.SUBSCRIPTIONS },
    ],
  },
  {
    section: "Insights",
    items: [
      { label: "Calendar", icon: Calendar, to: ROUTES.CALENDAR },
      { label: "Reports", icon: BarChart3, to: ROUTES.REPORTS },
      { label: "Smart Insights", icon: Lightbulb, to: ROUTES.INSIGHTS },
    ],
  },
];

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-30 flex flex-col",
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        {/* ---- Logo ---- */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <div className="font-bold text-gray-900 dark:text-white text-sm leading-none">
                  TrackVault
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  Personal Finance Manager
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* ---- Navigation ---- */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map(({ section, items }) => (
            <div key={section} className="mb-4">
              {isSidebarOpen && (
                <div className="px-3 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {section}
                  </span>
                </div>
              )}

              {items.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === ROUTES.DASHBOARD}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5",
                      "transition-all duration-150",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    )
                  }
                  title={!isSidebarOpen ? label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="truncate">{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ---- Bottom: Settings + User ---- */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-2 flex-shrink-0">
          <NavLink
            to={ROUTES.SETTINGS}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1",
                "transition-all duration-150",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )
            }
            title={!isSidebarOpen ? "Settings" : undefined}
          >
            <Settings size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span>Settings</span>}
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>

            {isSidebarOpen && (
              <>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || ""}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
