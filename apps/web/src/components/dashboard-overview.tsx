import { CheckCircle2, CircleAlert, FolderOpen, Timer, Users } from 'lucide-react'
import { Button } from './ui/button'

type DashboardOverviewProps = {
  onCreateProject: () => void
}

export function DashboardOverview({ onCreateProject }: DashboardOverviewProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold dark:text-slate-100">
            欢迎回来，Ji Li
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            这里是你今天项目的最新动态
          </p>
        </div>
        <Button
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          onClick={onCreateProject}
        >
          + 新建项目
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: '项目总数',
            value: '0',
            desc: '测试组织内项目数',
            icon: <FolderOpen size={18} className="text-blue-600" />,
            color: 'bg-blue-50 dark:bg-blue-500/20',
          },
          {
            title: '已完成项目',
            value: '0',
            desc: '共 0 个',
            icon: <CheckCircle2 size={18} className="text-emerald-600" />,
            color: 'bg-emerald-50 dark:bg-emerald-500/20',
          },
          {
            title: '我的任务',
            value: '0',
            desc: '分配给我',
            icon: <Users size={18} className="text-purple-600" />,
            color: 'bg-purple-50 dark:bg-purple-500/20',
          },
          {
            title: '逾期',
            value: '0',
            desc: '需要关注',
            icon: <CircleAlert size={18} className="text-amber-600" />,
            color: 'bg-amber-50 dark:bg-amber-500/20',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {card.title}
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${card.color}`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-3 text-2xl font-semibold dark:text-slate-100">
              {card.value}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {card.desc}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                项目概览
              </h2>
              <button className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                查看全部 →
              </button>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <FolderOpen size={26} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                暂无项目
              </p>
              <Button
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                onClick={onCreateProject}
              >
                创建首个项目
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                最近动态
              </h2>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Timer size={26} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 dark:text-slate-500">暂无动态</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Users size={16} className="text-slate-400 dark:text-slate-500" />
                我的任务
              </div>
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                0
              </span>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
              暂无任务
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <CircleAlert size={16} className="text-slate-400 dark:text-slate-500" />
                逾期
              </div>
              <span className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                0
              </span>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
              暂无逾期
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Timer size={16} className="text-slate-400 dark:text-slate-500" />
                进行中
              </div>
              <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                0
              </span>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
              暂无进行中
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
