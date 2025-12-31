import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Folder,
  FolderOpen,
  LayoutGrid,
  Search,
  Settings,
  Timer,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export function DashboardPage() {
  const [organizationName, setOrganizationName] = useState('测试组织')
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orgs/mine`,
          { credentials: 'include' },
        )
        if (!response.ok) return
        const data = (await response.json()) as {
          organization?: { name?: string | null; logoUrl?: string | null } | null
        }
        if (!data.organization) return
        const name = data.organization.name?.trim()
        if (name) {
          setOrganizationName(name)
        }
        const logoUrl = data.organization.logoUrl?.trim() ?? ''
        if (logoUrl) {
          const normalized = logoUrl.startsWith('/')
            ? `${import.meta.env.VITE_API_BASE_URL}${logoUrl}`
            : logoUrl
          setOrganizationLogoUrl(normalized)
        }
      } catch {
        // Ignore organization fetch failures in the dashboard chrome.
      }
    }

    loadOrganization()
  }, [])

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#101828]">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                {organizationLogoUrl ? (
                  <img
                    src={organizationLogoUrl}
                    alt={`${organizationName} Logo`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm font-semibold">{organizationName}</p>
                <p className="text-xs text-slate-500">1 个工作区</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>

          <nav className="mt-8 space-y-1 text-sm">
            <button className="flex w-full items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-900">
              <LayoutGrid size={18} className="text-slate-700" />
              仪表盘
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
              <Folder size={18} className="text-slate-500" />
              项目
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
              <Users size={18} className="text-slate-500" />
              团队
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
              <Settings size={18} className="text-slate-500" />
              设置
            </button>
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-400" />
                我的任务
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                0
              </span>
            </div>
            <div className="mt-6 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span>项目</span>
              <span className="text-base">+</span>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400">
              <Search size={16} />
              <input
                placeholder="搜索项目、任务..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
            <div className="ml-6 flex items-center gap-4">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500">
                <Bell size={18} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
                Ji
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-6 px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">欢迎回来，Ji Li</h1>
                <p className="text-sm text-slate-500">
                  这里是你今天项目的最新动态
                </p>
              </div>
              <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
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
                  color: 'bg-blue-50',
                },
                {
                  title: '已完成项目',
                  value: '0',
                  desc: '共 0 个',
                  icon: <CheckCircle2 size={18} className="text-emerald-600" />,
                  color: 'bg-emerald-50',
                },
                {
                  title: '我的任务',
                  value: '0',
                  desc: '分配给我',
                  icon: <Users size={18} className="text-purple-600" />,
                  color: 'bg-purple-50',
                },
                {
                  title: '逾期',
                  value: '0',
                  desc: '需要关注',
                  icon: <CircleAlert size={18} className="text-amber-600" />,
                  color: 'bg-amber-50',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">{card.title}</div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${card.color}`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-3 text-2xl font-semibold">{card.value}</div>
                  <div className="text-xs text-slate-400">{card.desc}</div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-800">
                      项目概览
                    </h2>
                    <button className="text-sm text-slate-400 hover:text-slate-600">
                      查看全部 →
                    </button>
                  </div>
                  <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <FolderOpen size={26} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      暂无项目
                    </p>
                    <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                      创建首个项目
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-800">
                      最近动态
                    </h2>
                  </div>
                  <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <Timer size={26} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">暂无动态</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Users size={16} className="text-slate-400" />
                      我的任务
                    </div>
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      0
                    </span>
                  </div>
                  <p className="mt-6 text-center text-sm text-slate-400">
                    暂无任务
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CircleAlert size={16} className="text-slate-400" />
                      逾期
                    </div>
                    <span className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">
                      0
                    </span>
                  </div>
                  <p className="mt-6 text-center text-sm text-slate-400">
                    暂无逾期
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Timer size={16} className="text-slate-400" />
                      进行中
                    </div>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      0
                    </span>
                  </div>
                  <p className="mt-6 text-center text-sm text-slate-400">
                    暂无进行中
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
