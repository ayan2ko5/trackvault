// ============================================================
// FILE: client/src/routes/index.tsx  ← REPLACE your existing file
// CHANGES FROM PHASE 6:
//   Replaced 5 PlaceholderPage entries with real page components:
//   ExpensesPage, IncomePage, BudgetsPage, GoalsPage, SubscriptionsPage
// Everything else is identical to the Phase 6 router.
// ============================================================

import { createBrowserRouter } from "react-router-dom";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

// Dashboard (Phase 6)
import DashboardPage from "@/pages/dashboard/DashboardPage";

// Phase 7 — real module pages
import ExpensesPage from "@/pages/expenses/ExpensesPage";
import IncomePage from "@/pages/income/IncomePage";
import BudgetsPage from "@/pages/budgets/BudgetsPage";
import GoalsPage from "@/pages/goals/GoalsPage";
import SubscriptionsPage from "@/pages/subscriptions/SubscriptionsPage";

// Still placeholder — built in Phase 8
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm">Coming in the next phase</p>
  </div>
);

const router = createBrowserRouter([
  // ============================================================
  // GUEST ROUTES — redirects to dashboard if already logged in
  // ============================================================
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },

  // ============================================================
  // PROTECTED ROUTES — redirects to /login if not logged in
  // ============================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Dashboard
          { path: "/", element: <DashboardPage /> },

          // ---- Phase 7: Real pages now ----
          { path: "/expenses", element: <ExpensesPage /> },
          { path: "/income", element: <IncomePage /> },
          { path: "/budgets", element: <BudgetsPage /> },
          { path: "/goals", element: <GoalsPage /> },
          { path: "/subscriptions", element: <SubscriptionsPage /> },

          // ---- Phase 8: Still placeholders ----
          { path: "/categories", element: <PlaceholderPage title="Categories" /> },
          { path: "/calendar", element: <PlaceholderPage title="Calendar" /> },
          { path: "/reports", element: <PlaceholderPage title="Reports" /> },
          { path: "/insights", element: <PlaceholderPage title="Smart Insights" /> },

          // Settings
          { path: "/settings", element: <PlaceholderPage title="Settings" /> },
          { path: "/settings/profile", element: <PlaceholderPage title="Profile Settings" /> },
          { path: "/settings/security", element: <PlaceholderPage title="Security Settings" /> },

          // 404
          { path: "*", element: <PlaceholderPage title="Page Not Found" /> },
        ],
      },
    ],
  },
]);

export default router;