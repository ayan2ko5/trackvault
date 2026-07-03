
import { createBrowserRouter } from "react-router-dom";

// ---- Route Guards ----
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// ---- Layouts ----
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";

// ---- Auth Pages ----
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// ---- Dashboard ----
import DashboardPage from "@/pages/dashboard/DashboardPage";

// ---- CRUD Modules ----
import ExpensesPage from "@/pages/expenses/ExpensesPage";
import IncomePage from "@/pages/income/IncomePage";
import BudgetsPage from "@/pages/budgets/BudgetsPage";
import GoalsPage from "@/pages/goals/GoalsPage";
import SubscriptionsPage from "@/pages/subscriptions/SubscriptionsPage";

// ---- Phase 8: Final pages ----
import InsightsPage from "@/pages/insights/InsightsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import SecuritySettings from "@/pages/settings/SecuritySettings";

// ---- 404 page (inline — no separate file needed) ----
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
    <div className="text-6xl mb-2">🔍</div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Page not found
    </h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/"
      className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
    >
      ← Back to Dashboard
    </a>
  </div>
);

const router = createBrowserRouter([

  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [

          // ---- Dashboard ----
          {
            path: "/",
            element: <DashboardPage />,
          },

          // ---- Transactions ----
          {
            path: "/expenses",
            element: <ExpensesPage />,
          },
          {
            path: "/income",
            element: <IncomePage />,
          },

          // ---- Planning ----
          {
            path: "/budgets",
            element: <BudgetsPage />,
          },
          {
            path: "/goals",
            element: <GoalsPage />,
          },
          {
            path: "/subscriptions",
            element: <SubscriptionsPage />,
          },

          // ---- Insights & Reports ----
          {
            path: "/insights",
            element: <InsightsPage />,
          },
          {
            path: "/reports",
            element: <ReportsPage />,
          },

          // ---- Calendar ----
          {
            path: "/calendar",
            element: <CalendarPage />,
          },

          // ---- Categories ----
          {
            path: "/categories",
            element: <CategoriesPage />,
          },

          // ---- Settings (3 sub-pages) ----
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/settings/profile",
            element: <ProfileSettings />,
          },
          {
            path: "/settings/security",
            element: <SecuritySettings />,
          },

          // ---- 404 inside the app ----
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

export default router;