import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateProjectDialog } from './create-project-dialog'
import { CreateOrganizationDialog } from './create-organization-dialog'
import { DashboardOverview } from './dashboard-overview'
import { OrganizationSwitcher } from './organization-switcher'
import { ProjectsPage } from './projects-page'
import { SettingsDialog } from './settings-dialog'
import { SidebarNav } from './sidebar-nav'
import { TeamPage } from './team-page'
import { TopBar } from './top-bar'

type DashboardNav = 'dashboard' | 'projects' | 'team' | 'settings'

export function DashboardPage() {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<
    { id: number; name: string; logoUrl: string | null }[]
  >([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
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

  const selectedOrg =
    organizations.find((org) => org.id === selectedOrgId) ?? null
  const workspaceName = selectedOrg?.name ?? '测试组织'

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#101828] dark:bg-[#0b0f1a] dark:text-slate-100">
      <CreateOrganizationDialog
        open={createWorkspaceOpen}
        onCreated={() => {
          setCreateWorkspaceOpen(false)
          loadOrganizations()
        }}
        onClose={() => setCreateWorkspaceOpen(false)}
      />
      <CreateProjectDialog
        open={createProjectOpen}
        workspaceName={workspaceName}
        onClose={() => setCreateProjectOpen(false)}
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
              <ProjectsPage onCreateProject={() => setCreateProjectOpen(true)} />
            ) : activeNav === 'team' ? (
              <TeamPage />
            ) : (
              <DashboardOverview
                onCreateProject={() => setCreateProjectOpen(true)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
