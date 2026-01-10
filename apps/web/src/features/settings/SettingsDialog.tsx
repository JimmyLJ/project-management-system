import { useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Shield, User, X } from "lucide-react";

type SettingsTab = "profile" | "security";

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const mockUser = {
  name: "李明",
  email: "liming@example.com",
  avatar: null,
};

const mockDevice = {
  os: "Windows",
  browser: "Chrome 120.0.0.0",
  ip: "192.168.1.100 (北京)",
  lastActive: "今天 14:30",
};

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: "个人资料", icon: User },
    { id: "security" as const, label: "安全设置", icon: Shield },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-5xl p-0 overflow-hidden"
        showCloseButton={false}
      >
        <div className="flex h-[500px]">
          {/* 左侧导航 */}
          <div className="w-52 border-r border-slate-200 p-6 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              账户设置
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              管理您的账户信息
            </p>

            <nav className="mt-6 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                      : "text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 overflow-y-auto">
            {/* 标题栏 */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {activeTab === "profile" ? "个人资料" : "安全设置"}
              </h3>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {activeTab === "profile" ? <ProfileSettings /> : <SecuritySettings />}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      {/* 个人资料 */}
      <SettingRow label="个人资料">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white">
              {mockUser.name.charAt(0)}
            </div>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {mockUser.name}
            </span>
          </div>
          <button className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            修改资料
          </button>
        </div>
      </SettingRow>

      {/* 邮箱地址 */}
      <SettingRow label="邮箱地址">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-slate-100">{mockUser.email}</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                主邮箱
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              •••
            </button>
          </div>
          <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            <span>+</span> 添加邮箱地址
          </button>
        </div>
      </SettingRow>

      {/* 关联账号 */}
      <SettingRow label="关联账号">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-slate-900 dark:text-slate-100">Google</span>
            <span className="text-slate-500 dark:text-slate-400">• {mockUser.email}</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            •••
          </button>
        </div>
      </SettingRow>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* 密码 */}
      <SettingRow label="密码">
        <button className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          设置密码
        </button>
      </SettingRow>

      {/* 活跃设备 */}
      <SettingRow label="活跃设备">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 dark:bg-slate-700">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v12H3V4zm0 14h18v2H3v-2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {mockDevice.os}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  当前设备
                </span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {mockDevice.browser}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {mockDevice.ip}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {mockDevice.lastActive}
              </div>
            </div>
          </div>
        </div>
      </SettingRow>

      {/* 删除账号 */}
      <SettingRow label="删除账号">
        <button className="text-sm text-red-500 hover:text-red-600">
          删除账号
        </button>
      </SettingRow>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-200 pb-6 last:border-0 dark:border-slate-700">
      <div className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </div>
      {children}
    </div>
  );
}
