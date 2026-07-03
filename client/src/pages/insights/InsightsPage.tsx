
import useInsights from "@/hooks/useInsights";
import { getScoreGradient } from "@/utils/healthScore";
import { cn } from "@/utils/cn";
import type { InsightSeverity } from "@/utils/insightEngine";

const severityStyles: Record<
    InsightSeverity,
    { border: string; bg: string; iconBg: string; title: string }
> = {
    danger: {
        border: "border-rose-200 dark:border-rose-800/50",
        bg: "bg-rose-50/50 dark:bg-rose-950/10",
        iconBg: "bg-rose-100 dark:bg-rose-950/40",
        title: "text-rose-700 dark:text-rose-300",
    },
    warning: {
        border: "border-amber-200 dark:border-amber-800/50",
        bg: "bg-amber-50/50 dark:bg-amber-950/10",
        iconBg: "bg-amber-100 dark:bg-amber-950/40",
        title: "text-amber-700 dark:text-amber-300",
    },
    good: {
        border: "border-emerald-200 dark:border-emerald-800/50",
        bg: "bg-emerald-50/50 dark:bg-emerald-950/10",
        iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
        title: "text-emerald-700 dark:text-emerald-300",
    },
    info: {
        border: "border-indigo-200 dark:border-indigo-800/50",
        bg: "bg-indigo-50/50 dark:bg-indigo-950/10",
        iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
        title: "text-indigo-700 dark:text-indigo-300",
    },
};

const InsightSkeleton = () => (
    <div className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
    </div>
);

const HealthScoreRing = ({
    score,
    label,
    color,
    breakdown,
}: {
    score: number;
    label: string;
    color: string;
    breakdown: any;
}) => {
    const gradient = getScoreGradient(score);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Financial Health Score
            </h3>

            <div className="text-center mb-4">
                <div className={cn("text-5xl font-bold mb-1", color)}>{score}</div>
                <div className={cn("text-sm font-medium", color)}>{label}</div>
            </div>

            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
                <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", gradient)}
                    style={{ width: `${score}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-5">
                <span>Poor (0)</span>
                <span>Average (41)</span>
                <span>Good (61)</span>
                <span>Excellent (81)</span>
            </div>

            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                <ScoreBar label="Savings Rate" value={breakdown.savingsRateScore} max={35} detail={`${breakdown.savingsRate}% of income saved`} color="bg-emerald-500" />
                <ScoreBar label="Budget Adherence" value={breakdown.budgetScore} max={35} detail={`${breakdown.budgetsAdherence}% budgets on track`} color="bg-indigo-500" />
                <ScoreBar label="Expense Consistency" value={breakdown.consistencyScore} max={30} detail={`${breakdown.expenseVariance}% variance vs last month`} color="bg-amber-500" />
            </div>
        </div>
    );
};

const ScoreBar = ({
    label,
    value,
    max,
    detail,
    color,
}: {
    label: string;
    value: number;
    max: number;
    detail: string;
    color: string;
}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{value}/{max}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
                className={cn("h-full rounded-full transition-all duration-700", color)}
                style={{ width: `${(value / max) * 100}%` }}
            />
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{detail}</div>
    </div>
);

const InsightsPage = () => {
    const { data, isLoading, isError, refetch } = useInsights();

    const insights = data?.insights || [];
    const healthScore = data?.healthScore;
    const period = data?.period;

    const dangerInsights = insights.filter((i) => i.severity === "danger");
    const warningInsights = insights.filter((i) => i.severity === "warning");
    const goodInsights = insights.filter((i) => i.severity === "good");
    const infoInsights = insights.filter((i) => i.severity === "info");

    return (
        <div className="max-w-6xl mx-auto space-y-5">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Smart Insights</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {period ? `${period.month} ${period.year}` : "This month"} · {insights.length} insights generated
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                    Refresh
                </button>
            </div>

            {isError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-sm text-rose-700 dark:text-rose-300">
                    Failed to load insights. Make sure you have transaction data this month.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <InsightSkeleton key={i} />)
                    ) : insights.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <span className="text-4xl">💡</span>
                            <h3 className="font-semibold text-gray-900 dark:text-white">No insights yet</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                                Add income and expense data for at least one month to see personalized insights.
                            </p>
                        </div>
                    ) : (
                        <>
                            {dangerInsights.length > 0 && (
                                <SectionHeader label="⚠️ Needs Attention" count={dangerInsights.length} />
                            )}
                            {dangerInsights.map((insight) => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))}

                            {warningInsights.length > 0 && (
                                <SectionHeader label="📊 Watch These" count={warningInsights.length} />
                            )}
                            {warningInsights.map((insight) => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))}

                            {goodInsights.length > 0 && (
                                <SectionHeader label="✅ Positive Trends" count={goodInsights.length} />
                            )}
                            {goodInsights.map((insight) => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))}

                            {infoInsights.length > 0 && (
                                <SectionHeader label="ℹ️ Did You Know" count={infoInsights.length} />
                            )}
                            {infoInsights.map((insight) => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))}
                        </>
                    )}
                </div>

                <div>
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 h-72 animate-pulse" />
                    ) : healthScore ? (
                        <HealthScoreRing
                            score={healthScore.score}
                            label={healthScore.label}
                            color={healthScore.color}
                            breakdown={healthScore.breakdown}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ label, count }: { label: string; count: number }) => (
    <div className="flex items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
        </span>
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
            {count}
        </span>
    </div>
);

const InsightCard = ({ insight }: { insight: any }) => {
    const styles = severityStyles[insight.severity as InsightSeverity];

    return (
        <div
            className={cn(
                "flex gap-3 p-4 rounded-2xl border transition-shadow hover:shadow-sm",
                styles.border,
                styles.bg
            )}
        >
            <div
                className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                    styles.iconBg
                )}
            >
                {insight.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-semibold mb-1", styles.title)}>
                    {insight.title}
                    {insight.changePercent !== undefined && (
                        <span className="ml-2 text-xs font-normal opacity-70">
                            ({insight.changePercent > 0 ? "+" : ""}{insight.changePercent}%)
                        </span>
                    )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {insight.description}
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;