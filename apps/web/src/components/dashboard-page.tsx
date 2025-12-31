import {
  ChevronDown,
  CheckCircle2,
  CircleAlert,
  FolderOpen,
  Plus,
  Search,
  Timer,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateOrganizationDialog } from './create-organization-dialog'
import { OrganizationSwitcher } from './organization-switcher'
import { SettingsDialog } from './settings-dialog'
import { SidebarNav } from './sidebar-nav'
import { TopBar } from './top-bar'
import { Button } from './ui/button'

type DashboardNav = 'dashboard' | 'projects' | 'team' | 'settings'

export function DashboardPage() {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<
    { id: number; name: string; logoUrl: string | null }[]
  >([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<DashboardNav>('dashboard')

  const normalizeLogoUrl = (logoUrl: string | null) => {
    if (!logoUrl) return null
    const trimmed = logoUrl.trim()
    if (!trimmed) return null
    return trimmed.startsWith('/')
      ? `${import.meta.env.VITE_API_BASE_URL}${trimmed}`
      : trimmed
  }

  const loadOrganizations = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orgs`,
        { credentials: 'include' },
      )
      if (!response.ok) return
      const data = (await response.json()) as {
        organizations?: { id: number; name: string; logoUrl: string | null }[]
      }
      const list = (data.organizations ?? []).map((org) => ({
        ...org,
        logoUrl: normalizeLogoUrl(org.logoUrl),
      }))
      setOrganizations(list)
      if (list.length === 0) {
        setSelectedOrgId(null)
        return
      }
      setSelectedOrgId((current) => {
        if (current && list.some((org) => org.id === current)) {
          return current
        }
        return list[0].id
      })
    } catch {
      // Ignore organization fetch failures in the dashboard chrome.
    }
  }, [])

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignore logout failures; still exit client session.
    } finally {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#101828] dark:bg-[#0b0f1a] dark:text-slate-100">
      <CreateOrganizationDialog
        open={createWorkspaceOpen}
        onCreated={() => {
          setCreateWorkspaceOpen(false)
          setWorkspaceMenuOpen(false)
          loadOrganizations()
        }}
        onClose={() => setCreateWorkspaceOpen(false)}
      />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-[#0f172a]">
          <OrganizationSwitcher
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
            onOpenCreateWorkspace={() => setCreateWorkspaceOpen(true)}
          />

          <SidebarNav
            activeNav={activeNav}
            onChangeNav={setActiveNav}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </aside>

        <div className="flex flex-1 flex-col">
          <TopBar
            onLogout={handleLogout}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <main className="flex-1 space-y-6 px-8 py-8">
            {activeNav === 'projects' ? (
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
                  <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
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
                  <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                    <Plus size={16} className="mr-2" />
                    创建项目
                  </Button>
                </div>
              </section>
            ) : activeNav === 'team' ? (
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
                      <span className="font-semibold text-slate-800 dark:text-slate-100">李祎</span>
                    </div>
                    <span>hopskyline@gmail.com</span>
                    <span className="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-200">
                      管理员
                    </span>
                  </div>
                </div>
              </section>
            ) : (
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
                      color: 'bg-blue-50 dark:bg-blue-500/20',
                    },
                    {
                      title: '已完成项目',
                      value: '0',
                      desc: '共 0 个',
                      icon: (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ),
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
                        <Button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
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
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
