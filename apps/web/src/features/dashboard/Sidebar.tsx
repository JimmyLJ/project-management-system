import { CheckSquare, ChevronRight, Folder, LayoutDashboard, List, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "仪表盘", icon: LayoutDashboard, to: "/" },
  { label: "项目", icon: Folder, to: "/projects" },
  { label: "团队", icon: Users, to: "/teams" },
  { label: "设置", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-[var(--dash-border)] bg-[var(--dash-card)]">
      <div className="flex items-center gap-3 border-b border-[var(--dash-border)] px-6 py-5">
        <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-full bg-slate-300 dark:bg-slate-700" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">测试组织1</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">1 个工作区</div>
        </div>
        <ChevronRight className="h-4 w-4 rotate-90 text-slate-400 dark:text-slate-500" />
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => (
          <NavItem key={item.label} label={item.label} icon={<item.icon className="h-5 w-5" />} to={item.to} />
        ))}

        <div className="pt-8">
          <NavItem
            label="我的任务"
            icon={<CheckSquare className="h-5 w-5" />}
            badge="0"
            withChevron
          />
        </div>

        <div className="pt-6">
          <NavItem label="项目列表" icon={<List className="h-5 w-5" />} withChevron />
        </div>
      </nav>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  to,
  badge,
  withChevron
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  badge?: string;
  withChevron?: boolean;
}) {
  const baseClass = "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition";
  const activeClass = "bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100";
  const inactiveClass =
    "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100";

  const content = (
    <>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            {badge}
          </span>
        )}
        {withChevron && <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />}
      </div>
    </>
  );

  if (to) {
    return (
      <NavLink to={to} end={to === "/"} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        {content}
      </NavLink>
    );
  }

  return (
    <div className={`${baseClass} ${inactiveClass}`}>
      {content}
    </div>
  );
}
