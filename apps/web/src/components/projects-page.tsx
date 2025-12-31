import { ChevronDown, FolderOpen, Plus, Search } from 'lucide-react'
import { Button } from './ui/button'

type ProjectsPageProps = {
  onCreateProject: () => void
}

export function ProjectsPage({ onCreateProject }: ProjectsPageProps) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            项目
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            管理并跟踪你的项目
          </p>
        </div>
        <Button
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          onClick={onCreateProject}
        >
          <Plus size={16} className="mr-2" />
          新建项目
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
          <Search size={16} />
          <input
            placeholder="搜索项目..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
          />
        </div>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          全部状态
          <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          全部优先级
          <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <FolderOpen size={30} className="text-slate-400 dark:text-slate-500" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
            暂无项目
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            创建你的第一个项目开始使用
          </p>
        </div>
        <Button
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          onClick={onCreateProject}
        >
          <Plus size={16} className="mr-2" />
          创建项目
        </Button>
      </div>
    </section>
  )
}
