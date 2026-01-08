type StatusTone = "success" | "danger" | "info";

const badgeClasses: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  danger: "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
};

const iconBgClasses: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  danger: "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
};

export default function StatusCard({
  title,
  count,
  emptyText,
  icon,
  tone
}: {
  title: string;
  count: number;
  emptyText: string;
  icon: React.ReactNode;
  tone: StatusTone;
}) {
  return (
    <div className="flex h-[210px] flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),_0_16px_40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between border-b border-[var(--dash-border)] pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBgClasses[tone]}`}>{icon}</div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span>
        </div>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${badgeClasses[tone]}`}>{count}</span>
      </div>
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">{emptyText}</div>
    </div>
  );
}
