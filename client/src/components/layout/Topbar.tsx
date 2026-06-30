
import { Menu, Sun, Moon, Search, Bell, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useUIStore from "../../store/uiStore";
import { ROUTES } from "../../constants/routes";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/income": "Income",
  "/budgets": "Budgets",
  "/goals": "Savings Goals",
  "/subscriptions": "Subscriptions",
  "/calendar": "Calendar",
  "/reports": "Reports",
  "/insights": "Smart Insights",
  "/categories": "Categories",
  "/settings": "Settings",
  "/settings/profile": "Profile Settings",
  "/settings/security": "Security Settings",
};

const Topbar = () => {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = pageTitles[location.pathname] || "TrackVault";

  return (
    <header className="h-16 flex items-center gap-3 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 sticky top-0 z-10">

      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg flex-1 min-w-0 truncate">
        {pageTitle}
      </h1>

      {/* Search bar (desktop only) */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 h-9 w-48 lg:w-64">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none w-full"
        />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative">
          <Bell size={18} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Add expense quick action */}
        <button
          onClick={() => navigate(ROUTES.EXPENSES)}
          className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 h-9 rounded-xl transition-colors"
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;