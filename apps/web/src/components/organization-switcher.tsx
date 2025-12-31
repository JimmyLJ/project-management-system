import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'

type Organization = { id: number; name: string; logoUrl: string | null }

type OrganizationSwitcherProps = {
  organizations: Organization[]
  selectedOrgId: number | null
  onSelectOrg: (id: number) => void
  onOpenCreateWorkspace: () => void
}

export function OrganizationSwitcher({
  organizations,
  selectedOrgId,
  onSelectOrg,
  onOpenCreateWorkspace,
}: OrganizationSwitcherProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const selectedOrg =
    organizations.find((org) => org.id === selectedOrgId) ?? null
  const organizationName = selectedOrg?.name ?? '测试组织'
  const organizationLogoUrl = selectedOrg?.logoUrl ?? null
  const orgInitial = (() => {
    const trimmed = organizationName.trim()
    if (!trimmed) return ''
    return /[a-z]/i.test(trimmed[0]) ? trimmed[0].toUpperCase() : trimmed[0]
  })()

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-xl px-2 py-2 transition hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800 ${
          menuOpen ? 'bg-slate-100 dark:bg-slate-800' : ''
        }`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-200 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            {organizationLogoUrl ? (
              <img
                src={organizationLogoUrl}
                alt={`${organizationName} Logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              orgInitial
            )}
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-sm font-semibold">{organizationName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {organizations.length} 个工作区
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition dark:text-slate-500 ${
            menuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {menuOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold tracking-[0.2em] text-slate-400 dark:text-slate-500">
            工作区
          </div>
          {organizations.length > 0 ? (
            <div className="space-y-1">
              {organizations.map((org) => {
                const isSelected = org.id === selectedOrgId
                const initial = org.name.trim()
                  ? /[a-z]/i.test(org.name.trim()[0])
                    ? org.name.trim()[0].toUpperCase()
                    : org.name.trim()[0]
                  : ''
                return (
                  <button
                    key={org.id}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800 ${
                      isSelected ? 'bg-slate-50 dark:bg-slate-800' : ''
                    }`}
                    onClick={() => {
                      onSelectOrg(org.id)
                      setMenuOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-slate-200 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl}
                            alt={`${org.name} Logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {org.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          1 名成员
                        </p>
                      </div>
                    </div>
                    {isSelected ? (
                      <Check size={16} className="text-blue-600 dark:text-blue-400" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
              暂无工作区
            </div>
          )}
          <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer dark:text-blue-400 dark:hover:bg-slate-800"
            onClick={() => {
              setMenuOpen(false)
              onOpenCreateWorkspace()
            }}
          >
            <Plus size={16} />
            新建工作区
          </button>
        </div>
      ) : null}
    </div>
  )
}
