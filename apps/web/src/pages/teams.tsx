import { Activity, ListChecks, Search, UserPlus, Users } from "lucide-react";

export default function Teams() {
  const stats = [
    {
      label: "总成员",
      value: "1",
      icon: <Users className="h-5 w-5" />,
      tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
    },
    {
      label: "活跃项目",
      value: "0",
      icon: <Activity className="h-5 w-5" />,
      tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
    },
    {
      label: "总任务",
      value: "0",
      icon: <ListChecks className="h-5 w-5" />,
      tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--dash-text)]">团队</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">管理团队成员及其贡献</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)]">
          <UserPlus className="h-4 w-4" />
          邀请成员
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),_0_16px_40px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-start justify-between">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.tone}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</div>
          </div>
        ))}
      </section>

      <section>
        <div className="relative w-full max-w-[520px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="搜索团队成员..."
            className="h-10 w-full rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] shadow-[0_1px_2px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),_0_16px_40px_rgba(0,0,0,0.55)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="px-6 py-3 font-medium">姓名</th>
              <th className="px-6 py-3 font-medium">邮箱</th>
              <th className="px-6 py-3 font-medium">角色</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--dash-border)] text-slate-700 dark:text-slate-300">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">
                    Ji
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">Ji Li</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">hopskyline@gmail.com</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                  管理员
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
