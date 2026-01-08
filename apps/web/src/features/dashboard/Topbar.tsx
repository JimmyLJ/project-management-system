import { Moon, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex flex-col gap-2 border-b border-[var(--dash-border)] pb-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="搜索项目、任务..."
          className="h-9 w-full rounded-lg border border-[var(--dash-border)] bg-white pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dash-border)] bg-white text-slate-500 transition hover:bg-slate-50">
          <Moon className="h-5 w-5" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
          Ji
        </div>
      </div>
    </header>
  );
}
