import { ChevronDown, Folder, Plus, Search } from "lucide-react";
import EmptyState from "~/features/dashboard/EmptyState";

export default function Projects() {
  const statusOptions = ["全部状态", "进行中", "规划中", "已完成", "暂停", "已取消"];
  const priorityOptions = ["全部优先级", "高", "中", "低"];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--dash-text)]">项目</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">管理并追踪你的项目</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)]">
          <Plus className="h-4 w-4" />
          新建项目
        </button>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-[420px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="搜索项目..."
            className="h-10 w-full rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative w-full min-w-[160px] sm:w-44">
            <select
              defaultValue={statusOptions[0]}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="relative w-full min-w-[160px] sm:w-44">
            <select
              defaultValue={priorityOptions[0]}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </section>

      <section className="flex min-h-[420px] items-center justify-center">
        <EmptyState
          icon={<Folder className="h-8 w-8" />}
          title="未找到项目"
          description="创建你的第一个项目开始使用"
          action={
            <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)]">
              <Plus className="h-4 w-4" />
              新建项目
            </button>
          }
        />
      </section>
    </div>
  );
}
