import { Outlet } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  Target,
  PieChart,
} from "lucide-react";

const stats = [
  { label: "Track Expenses", icon: TrendingUp, color: "text-indigo-400" },
  { label: "Set Budgets", icon: Shield, color: "text-emerald-400" },
  { label: "Achieve Goals", icon: Target, color: "text-amber-400" },
  { label: "View Reports", icon: PieChart, color: "text-rose-400" },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* ---- LEFT PANEL — Branding (hidden on mobile) ---- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none">TrackVault</div>
              <div className="text-indigo-200 text-xs">Your Personal Finance Hub</div>
            </div>
          </div>

          {/* Main message */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Take control of your
              <span className="block text-indigo-200">finances today</span>
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
              Track expenses, manage income, set budgets, achieve savings goals, and gain smart financial insights — all in one secure dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {stats.map(({ label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-indigo-300 text-sm">
            "A budget is telling your money where to go, instead of wondering where it went."
            <br />
            <span className="text-indigo-200 font-medium">— Dave Ramsey</span>
          </p>
        </div>
      </div>

      {/* ---- RIGHT PANEL — Auth Form ---- */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              TrackVault
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
