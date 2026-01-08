type StatusTone = "success" | "danger" | "info";

const badgeClasses: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600"
};

const iconBgClasses: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-600",
  danger: "bg-orange-50 text-orange-600",
  info: "bg-blue-50 text-blue-600"
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
    <div className="flex h-[210px] flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBgClasses[tone]}`}>{icon}</div>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${badgeClasses[tone]}`}>{count}</span>
      </div>
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">{emptyText}</div>
    </div>
  );
}
