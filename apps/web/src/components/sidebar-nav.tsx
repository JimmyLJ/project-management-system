import {
  CheckCircle2,
  Folder,
  LayoutGrid,
  Settings,
  Users,
} from 'lucide-react'

type DashboardNav = 'dashboard' | 'projects' | 'team' | 'settings'

type SidebarNavProps = {
  activeNav: DashboardNav
  onChangeNav: (next: DashboardNav) => void
  onOpenSettings: () => void
}

export function SidebarNav({
  activeNav,
  onChangeNav,
  onOpenSettings,
}: SidebarNavProps) {
  return (
    <>
      <nav className="mt-8 space-y-1 text-sm">
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 font-semibold ${
            activeNav === 'dashboard'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          data-testid="nav-dashboard"
          onClick={() => onChangeNav('dashboard')}
        >
          <LayoutGrid
            size={18}
            className={
              activeNav === 'dashboard'
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-500 dark:text-slate-400'
            }
          />
          仪表盘
        </button>
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 font-semibold ${
            activeNav === 'projects'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          data-testid="nav-projects"
          onClick={() => onChangeNav('projects')}
        >
          <Folder
            size={18}
            className={
              activeNav === 'projects'
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-500 dark:text-slate-400'
            }
          />
          项目
        </button>
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 font-semibold ${
            activeNav === 'team'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          data-testid="nav-team"
          onClick={() => onChangeNav('team')}
        >
          <Users
            size={18}
            className={
              activeNav === 'team'
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-500 dark:text-slate-400'
            }
          />
          团队
        </button>
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 font-semibold ${
            activeNav === 'settings'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          onClick={onOpenSettings}
          data-testid="nav-settings"
        >
          <Settings
            size={18}
            className={
              activeNav === 'settings'
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-500 dark:text-slate-400'
            }
          />
          设置
        </button>
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-slate-400 dark:text-slate-500" />
            我的任务
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            0
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          <span>项目</span>
          <span className="text-base">+</span>
        </div>
      </div>
    </>
  )
}
