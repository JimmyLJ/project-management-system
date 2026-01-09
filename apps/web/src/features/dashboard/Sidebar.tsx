import { CheckSquare, ChevronRight, Folder, LayoutDashboard, List, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import WorkspaceSelector from "~/features/workspace/WorkspaceSelector";
import type { Workspace } from "~/features/workspace/types";

type SidebarProps = {
  workspaces: Workspace[];
  currentWorkspace?: Workspace;
  isLoading: boolean;
};

export default function Sidebar({ workspaces, currentWorkspace, isLoading }: SidebarProps) {
  const basePath = currentWorkspace ? `/w/${currentWorkspace.slug}` : "";
  const navItems = [
    { label: "仪表盘", icon: LayoutDashboard, to: basePath || undefined, end: true },
    { label: "项目", icon: Folder, to: basePath ? `${basePath}/projects` : undefined },
    { label: "团队", icon: Users, to: basePath ? `${basePath}/teams` : undefined },
    { label: "设置", icon: Settings }
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-[var(--dash-border)] bg-[var(--dash-card)]">
      <WorkspaceSelector workspaces={workspaces} currentWorkspace={currentWorkspace} isLoading={isLoading} />

      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={<item.icon className="h-5 w-5" />}
            to={item.to}
            end={item.end}
          />
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
  withChevron,
  end,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  badge?: string;
  withChevron?: boolean;
  end?: boolean;
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
      <NavLink to={to} end={end} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
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
