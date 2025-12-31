import { useEffect, useRef, useState } from 'react'
import { LogOut, Moon, Search, Sun, UserRound } from 'lucide-react'

type TopBarProps = {
  onLogout: () => void
  onOpenSettings: () => void
}

export function TopBar({ onLogout, onOpenSettings }: TopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedTheme = localStorage.getItem('theme')
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme
      ? storedTheme === 'dark'
      : prefersDark
    setIsDarkMode(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  useEffect(() => {
    if (!accountMenuOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!accountMenuRef.current) return
      if (!accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [accountMenuOpen])

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900/60">
        <Search size={16} />
        <input
          placeholder="搜索项目、任务..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
        />
      </div>
      <div className="ml-6 flex items-center gap-4">
        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform hover:scale-105 dark:border-slate-700 dark:text-slate-300"
          onClick={handleToggleTheme}
          aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} />}
        </button>
        <div className="relative" ref={accountMenuRef}>
          <button
            type="button"
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-teal-500 text-sm font-semibold text-white"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
          >
            <span className="pointer-events-none absolute -left-10 top-1/2 h-12 w-6 -translate-y-1/2 rotate-45 bg-white/70 opacity-0 blur-[1px] transition duration-500 group-hover:translate-x-24 group-hover:opacity-100" />
            Ji
          </button>
          {accountMenuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-3 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0f172a]">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
                  Ji
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    李祎
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    hopskyline@gmail.com
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-200/70 dark:bg-slate-800/60" />
              <button
                type="button"
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => {
                  setAccountMenuOpen(false)
                  onOpenSettings()
                }}
              >
                <UserRound size={16} className="text-slate-400 dark:text-slate-500" />
                账户设置
              </button>
              <div className="h-px bg-slate-200/70 dark:bg-slate-800/60" />
              <button
                type="button"
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => {
                  setAccountMenuOpen(false)
                  onLogout()
                }}
              >
                <LogOut size={16} className="text-slate-400 dark:text-slate-500" />
                退出登录
              </button>
              <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-4 dark:from-slate-900/80 dark:to-slate-900" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
