
import { useNavigate } from "react-router-dom";
import { MinusCircle, PlusCircle, Wallet, Target } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const actions = [
  {
    label: "Add Expense",
    icon: MinusCircle,
    to: ROUTES.EXPENSES,
    hoverColor: "hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
  },
  {
    label: "Add Income",
    icon: PlusCircle,
    to: ROUTES.INCOME,
    hoverColor: "hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
  },
  {
    label: "Set Budget",
    icon: Wallet,
    to: ROUTES.BUDGETS,
    hoverColor: "hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
  },
  {
    label: "Add Goal",
    icon: Target,
    to: ROUTES.GOALS,
    hoverColor: "hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h3>

      {/* 2x2 button grid — exactly matching your prototype */}
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ label, icon: Icon, to, hoverColor }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300",
              "text-sm font-medium transition-all duration-150",
              hoverColor
            )}
          >
            <Icon size={17} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;