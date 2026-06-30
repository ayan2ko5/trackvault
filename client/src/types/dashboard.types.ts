
export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  count: number;
}

export interface MonthlyTrendItem {
  month: string;   
  income: number;
  expense: number;
}

export interface RecentTransaction {
  id: string;
  userId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  date: string;
  note: string | null;
  paymentMethod: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: string;
  currentSpending: number;
  percentageUsed: number;
  alertStatus: "OK" | "WARNING" | "EXCEEDED";
}

export interface DashboardGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  remainingAmount: number;
  deadline: string | null;
  isCompleted: boolean;
}

export interface HealthScoreBreakdown {
  savingsRateScore: number;   
  budgetScore: number;        
  consistencyScore: number;   
}

export interface DashboardSummary {
  // Summary cards
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;

  healthScore: number;
  healthScoreLabel: "Poor" | "Average" | "Good" | "Excellent";
  healthScoreBreakdown: HealthScoreBreakdown;

  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];

  recentTransactions: RecentTransaction[];
  budgetAlerts: BudgetAlert[];
  goals: DashboardGoal[];
  totalSubscriptionCost: number;

  period: {
    month: string;
    year: number;
  };
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}