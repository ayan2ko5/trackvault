export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // App
  DASHBOARD: "/",
  EXPENSES: "/expenses",
  INCOME: "/income",
  BUDGETS: "/budgets",
  GOALS: "/goals",
  SUBSCRIPTIONS: "/subscriptions",
  CALENDAR: "/calendar",
  REPORTS: "/reports",
  INSIGHTS: "/insights",
  CATEGORIES: "/categories",

  // Settings
  SETTINGS: "/settings",
  PROFILE: "/settings/profile",
  SECURITY: "/settings/security",

  // Fallback
  NOT_FOUND: "*",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
