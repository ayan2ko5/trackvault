import { createBrowserRouter } from "react-router-dom";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// ---- Placeholder pages for modules not built yet ----
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm">Coming in the next phase</p>
  </div>
);

// ---- Router Configuration ----
const router = createBrowserRouter([
  // ============================================================
  // GUEST ROUTES — redirect to dashboard if already logged in
  // ============================================================
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
        ],
      },
    ],
  },

  // ============================================================
  // PROTECTED ROUTES — redirect to /login if not logged in
  // ============================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <PlaceholderPage title="Dashboard" />,
          },
          {
            path: "/expenses",
            element: <PlaceholderPage title="Expenses" />,
          },
          {
            path: "/income",
            element: <PlaceholderPage title="Income" />,
          },
          {
            path: "/categories",
            element: <PlaceholderPage title="Categories" />,
          },
          {
            path: "/budgets",
            element: <PlaceholderPage title="Budgets" />,
          },
          {
            path: "/goals",
            element: <PlaceholderPage title="Savings Goals" />,
          },
          {
            path: "/subscriptions",
            element: <PlaceholderPage title="Subscriptions" />,
          },
          {
            path: "/calendar",
            element: <PlaceholderPage title="Calendar" />,
          },
          {
            path: "/reports",
            element: <PlaceholderPage title="Reports" />,
          },
          {
            path: "/insights",
            element: <PlaceholderPage title="Smart Insights" />,
          },
          {
            path: "/settings",
            element: <PlaceholderPage title="Settings" />,
          },
          {
            path: "/settings/profile",
            element: <PlaceholderPage title="Profile Settings" />,
          },
          {
            path: "/settings/security",
            element: <PlaceholderPage title="Security Settings" />,
          },
          {
            path: "*",
            element: <PlaceholderPage title="Page Not Found" />,
          },
        ],
      },
    ],
  },
]);

export default router;
