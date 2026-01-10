import { useState } from "react";
import { CheckSquare, ChevronRight, Folder, LayoutDashboard, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import WorkspaceSelector from "~/features/workspace/WorkspaceSelector";
import type { Workspace } from "~/features/workspace/types";
import { useProjects } from "~/features/projects/hooks";
import type { Project } from "~/features/projects/types";
import SettingsDialog from "~/features/settings/SettingsDialog";

type SidebarProps = {
  workspaces: Workspace[];
  currentWorkspace?: Workspace;
  isLoading: boolean;
};

type Task = {
  id: string;
  title: string;
};

const myTasks: Task[] = [];

export default function Sidebar({ workspaces, currentWorkspace, isLoading }: SidebarProps) {
  const basePath = currentWorkspace ? `/w/${currentWorkspace.slug}` : "";
  const navItems = [
    { label: "仪表盘", icon: LayoutDashboard, to: basePath || undefined, end: true },
    { label: "项目", icon: Folder, to: basePath ? `${basePath}/projects` : undefined },
    { label: "团队", icon: Users, to: basePath ? `${basePath}/teams` : undefined },
  ];

  const { data: projects = [] } = useProjects(currentWorkspace?.id);

  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        <NavItem
          label="设置"
          icon={<Settings className="h-5 w-5" />}
          onClick={() => setSettingsOpen(true)}
        />

        <div className="pt-8">
          <ExpandableNavItem
            label="我的任务"
            icon={<CheckSquare className="h-5 w-5" />}
            badge={String(myTasks.length)}
            expanded={tasksExpanded}
            onToggle={() => setTasksExpanded(!tasksExpanded)}
          >
            {myTasks.length === 0 ? (
              <div className="py-2 pl-8 text-sm text-slate-500 dark:text-slate-400">暂无任务</div>
            ) : (
              <div className="space-y-1 pl-8">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="cursor-pointer rounded px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            )}
          </ExpandableNavItem>
        </div>

        <div className="pt-6">
          <ExpandableNavItem
            label="项目列表"
            icon={<Folder className="h-5 w-5" />}
            badge={String(projects.length)}
            expanded={projectsExpanded}
            onToggle={() => setProjectsExpanded(!projectsExpanded)}
          >
            {projects.length === 0 ? (
              <div className="py-2 pl-8 text-sm text-slate-500 dark:text-slate-400">暂无项目</div>
            ) : (
              <div className="space-y-1 pl-8">
                {projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className="cursor-pointer rounded px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
                  >
                    {project.name}
                  </div>
                ))}
              </div>
            )}
          </ExpandableNavItem>
        </div>
      </nav>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  badge?: string;
  withChevron?: boolean;
  end?: boolean;
  onClick?: () => void;
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
    <div className={`${baseClass} ${inactiveClass}`} onClick={onClick}>
      {content}
    </div>
  );
}

function ExpandableNavItem({
  icon,
  label,
  badge,
  expanded,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const baseClass = "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition";
  const inactiveClass =
    "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100";

  return (
    <div>
      <div className={`${baseClass} ${inactiveClass}`} onClick={onToggle}>
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
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
