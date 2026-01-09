import { CalendarDays, CheckCircle2, ChevronRight, Clock, Folder, Plus, TriangleAlert, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { CreateProjectDialog } from "~/features/projects/CreateProjectDialog";
import { useProjects } from "~/features/projects/hooks";
import type { ProjectStatus } from "~/features/projects/types";
import { useCurrentWorkspace } from "~/features/workspace/hooks";
import EmptyState from "./EmptyState";
import SectionCard from "./SectionCard";
import StatCard from "./StatCard";
import StatusCard from "./StatusCard";

const statusMeta: Record<ProjectStatus, { label: string; badgeClass: string; dotClass: string }> = {
  planning: {
    label: "规划中",
    badgeClass: "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-200",
    dotClass: "bg-amber-400",
  },
  active: {
    label: "进行中",
    badgeClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  completed: {
    label: "已完成",
    badgeClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  on_hold: {
    label: "暂停",
    badgeClass: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  cancelled: {
    label: "已取消",
    badgeClass: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
    dotClass: "bg-rose-500",
  },
};

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { currentWorkspace } = useCurrentWorkspace();
  const workspaceId = currentWorkspace?.id;
  const navigate = useNavigate();
  const { data: projects = [], isLoading: isProjectsLoading } = useProjects(workspaceId);
  const recentProjects = projects.slice(0, 3);
  const hasProjects = recentProjects.length > 0;
  const workspaceSlug = currentWorkspace?.slug;

  const openCreate = () => setIsCreateOpen(true);
  const handleViewAll = () => {
    if (!workspaceSlug) return;
    navigate(`/w/${workspaceSlug}/projects`);
  };

  const stats = [
    {
      label: "项目总数",
      value: "0",
      subtext: "测试组织1中的项目",
      tone: "primary",
      icon: <Folder className="h-5 w-5" />
    },
    {
      label: "已完成项目",
      value: "0",
      subtext: "共 0 个",
      tone: "success",
      icon: <CheckCircle2 className="h-5 w-5" />
    },
    {
      label: "我的任务",
      value: "0",
      subtext: "分配给我",
      tone: "indigo",
      icon: <UserRound className="h-5 w-5" />
    },
    {
      label: "逾期",
      value: "0",
      subtext: "需要关注",
      tone: "warning",
      icon: <TriangleAlert className="h-5 w-5" />
    }
  ] as const;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--dash-text)]">欢迎回来，Ji Li</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">看看你今天项目的最新动态</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)]"
        >
          <Plus className="h-4 w-4" />
          新建项目
        </button>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            tone={stat.tone}
            icon={stat.icon}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            title="项目概览"
            actionLabel="查看全部"
            actionIcon={<ChevronRight className="h-4 w-4" />}
            className="min-h-[360px]"
            onAction={handleViewAll}
          >
            {isProjectsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                正在加载项目...
              </div>
            ) : hasProjects ? (
              <div className="space-y-6">
                {recentProjects.map((project) => {
                  const meta = statusMeta[project.status];
                  const displayDate = project.endDate || project.startDate;
                  const dateLabel = displayDate ? format(parseISO(displayDate), "MMM d, yyyy") : "未设置日期";
                  const progressValue = project.status === "completed" ? 100 : 0;
                  const memberCount = project.memberCount ?? 0;

                  return (
                    <div key={project.id} className="space-y-4 border-b border-[var(--dash-border)] pb-6 last:border-b-0 last:pb-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{project.name}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {project.description || "暂无描述"}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {memberCount} 成员
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {dateLabel}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
                            {meta.label}
                          </span>
                          <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>进度</span>
                          <span>{progressValue}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-[var(--dash-primary)]"
                            style={{ width: `${progressValue}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Folder className="h-8 w-8" />}
                title="暂无项目"
                action={
                  <button
                    onClick={openCreate}
                    className="rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--dash-primary-strong)]"
                  >
                    创建你的第一个项目
                  </button>
                }
              />
            )}
          </SectionCard>

          <SectionCard title="最近活动" className="min-h-[320px]">
            <EmptyState icon={<Clock className="h-8 w-8" />} title="暂无最近活动" />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <StatusCard title="我的任务" count={0} emptyText="暂无任务" tone="success" icon={<UserRound className="h-4 w-4" />} />
          <StatusCard title="逾期" count={0} emptyText="暂无逾期" tone="danger" icon={<TriangleAlert className="h-4 w-4" />} />
          <StatusCard title="进行中" count={0} emptyText="暂无进行中" tone="info" icon={<Clock className="h-4 w-4" />} />
        </div>
      </section>

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        workspaceId={workspaceId}
        workspaceName={currentWorkspace?.name}
        onSuccess={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
