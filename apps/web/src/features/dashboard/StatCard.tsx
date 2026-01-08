type StatTone = "primary" | "success" | "indigo" | "warning";

const toneClasses: Record<StatTone, string> = {
  primary: "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
  warning: "bg-orange-50 text-orange-600"
};

export default function StatCard({
  label,
  value,
  subtext,
  icon,
  tone
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  tone: StatTone;
}) {
  return (
    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{subtext}</div>
    </div>
  );
}
