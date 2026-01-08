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
      className={`flex flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {actionLabel ? (
          <button className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700">
            <span>{actionLabel}</span>
            {actionIcon}
          </button>
        ) : null}
      </div>
      <div className="flex-1 pt-6">{children}</div>
    </section>
  );
}
