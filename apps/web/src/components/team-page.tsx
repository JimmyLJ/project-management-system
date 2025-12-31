import { CheckCircle2, Search, Timer, Users } from 'lucide-react'
import { Button } from './ui/button'

export function TeamPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            团队
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            管理团队成员及其贡献
          </p>
        </div>
        <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
          <Users size={16} className="mr-2" />
          邀请成员
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: '成员总数',
            value: '1',
            icon: <Users size={18} className="text-blue-600" />,
            color: 'bg-blue-50 dark:bg-blue-500/20',
          },
          {
            title: '进行中项目',
            value: '0',
            icon: <Timer size={18} className="text-emerald-600" />,
            color: 'bg-emerald-50 dark:bg-emerald-500/20',
          },
          {
            title: '任务总数',
            value: '0',
            icon: <CheckCircle2 size={18} className="text-purple-600" />,
            color: 'bg-purple-50 dark:bg-purple-500/20',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {card.value}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-lg items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
        <Search size={16} />
        <input
          placeholder="搜索团队成员..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr] border-b border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>姓名</span>
          <span>邮箱</span>
          <span>角色</span>
        </div>
        <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr] items-center px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
              Ji
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              李祎
            </span>
          </div>
          <span>hopskyline@gmail.com</span>
          <span className="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-200">
            管理员
          </span>
        </div>
      </div>
    </section>
  )
}
