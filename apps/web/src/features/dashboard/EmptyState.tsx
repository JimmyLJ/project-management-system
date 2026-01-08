export default function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300 dark:bg-slate-800/70 dark:text-slate-500">
        {icon}
      </div>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-100">{title}</div>
      {description ? <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{description}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
