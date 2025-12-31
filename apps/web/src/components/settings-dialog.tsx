import { useEffect, useState } from 'react'
import { ShieldCheck, UserRound, X } from 'lucide-react'

type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

type SettingsTab = 'profile' | 'security'

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  useEffect(() => {
    if (open) {
      setActiveTab('profile')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 dark:bg-black/60">
      <div
        className="relative flex w-full max-w-[980px] min-h-[640px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:bg-[#0f172a]"
        data-testid="settings-dialog"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          data-testid="settings-close"
          aria-label="关闭设置"
        >
          <X size={18} />
        </button>

        <aside className="w-[280px] border-r border-slate-200 bg-gradient-to-b from-[#fbfbfc] via-white to-[#f6f1ed] px-8 py-10 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#111827] dark:via-[#0f172a] dark:to-[#0b1220]">
          <div>
            <h2 className="text-2xl font-semibold text-[#111827] dark:text-slate-100">
              账户
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              管理你的账户信息。
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'profile'
                  ? 'bg-slate-200/70 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <UserRound size={16} className="text-slate-500 dark:text-slate-400" />
              个人资料
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'security'
                  ? 'bg-slate-200/70 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck size={16} className="text-slate-500 dark:text-slate-400" />
              安全
            </button>
          </div>
        </aside>

        <section className="flex-1 px-10 py-10">
          {activeTab === 'profile' ? (
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                账户详情
              </h3>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800" />
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <div className="flex items-center justify-between py-6">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    头像
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                      Ji
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Ji Li
                    </div>
                  </div>
                  <button className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                    更新资料
                  </button>
                </div>

                <div className="flex items-center justify-between py-6">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    邮箱地址
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    hopskyline@gmail.com{' '}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      主邮箱
                    </span>
                  </div>
                  <button className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                    + 添加邮箱
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">安全</h3>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800" />
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <div className="flex items-center justify-between py-6">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    密码
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">设置密码</div>
                  <button className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                    修改
                  </button>
                </div>

                <div className="flex items-center justify-between py-6">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    活跃设备
                  </div>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-9 items-center justify-center rounded-sm bg-slate-900 text-[10px] text-white dark:bg-slate-200 dark:text-slate-900">
                        PC
                      </span>
                      Windows{' '}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        当前设备
                      </span>
                    </div>
                    <div>Chrome 143.0.0.0</div>
                    <div>45.78.50.59 (Osaka, JP)</div>
                    <div>今天 1:51 PM</div>
                  </div>
                  <button className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    ...
                  </button>
                </div>

                <div className="flex items-center justify-between py-6">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    删除账户
                  </div>
                  <button className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                    删除账户
                  </button>
                  <div />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
