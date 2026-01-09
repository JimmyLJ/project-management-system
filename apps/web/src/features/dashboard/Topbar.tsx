import { Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useAuthSession, useSignOut } from "~/features/auth/hooks";

const THEME_STORAGE_KEY = "pms-theme";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function Topbar() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { data: session } = useAuthSession();
  const signOutMutation = useSignOut();
  const displayName = session?.user?.name || session?.user?.email || "访客";
  const initialsSource = displayName.includes("@") ? displayName.split("@")[0] : displayName;
  const initials = initialsSource.slice(0, 2);
  const canSignOut = Boolean(session?.user);
  const signOutError = signOutMutation.isError ? "退出失败，请稍后重试" : "";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [isDark, theme]);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        setSignOutOpen(false);
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <header className="flex flex-col gap-2 border-b border-[var(--dash-border)] pb-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="搜索项目、任务..."
          className="h-9 w-full rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
          title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] text-slate-500 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/70"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => setSignOutOpen(true)}
          disabled={!canSignOut || signOutMutation.isPending}
          className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-slate-800/70"
        >
          退出登录
        </button>
        <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
          <DialogContent className="max-w-[420px]">
            <DialogHeader>
              <DialogTitle>确认退出</DialogTitle>
              <DialogDescription>退出后需要重新登录才能继续使用。</DialogDescription>
            </DialogHeader>
            {signOutError && <p className="mt-4 text-sm text-rose-600">{signOutError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSignOutOpen(false)}
                disabled={signOutMutation.isPending}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-300"
              >
                {signOutMutation.isPending ? "退出中..." : "确认退出"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-teal-500 px-2 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
