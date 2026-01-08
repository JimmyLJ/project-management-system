export default function SectionCard({
  title,
  actionLabel,
  actionIcon,
  children,
  className
}: {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),_0_16px_40px_rgba(0,0,0,0.55)] ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--dash-border)] pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {actionLabel ? (
          <button className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <span>{actionLabel}</span>
            {actionIcon}
          </button>
        ) : null}
      </div>
      <div className="flex-1 pt-6">{children}</div>
    </section>
  );
}
