import { CheckCircle2, ChevronRight, Clock, Folder, Plus, TriangleAlert, UserRound } from "lucide-react";
import EmptyState from "./EmptyState";
import SectionCard from "./SectionCard";
import StatCard from "./StatCard";
import StatusCard from "./StatusCard";

export default function DashboardPage() {
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
          <p className="mt-2 text-sm text-slate-500">看看你今天项目的最新动态</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)]">
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
          <SectionCard title="项目概览" actionLabel="查看全部" actionIcon={<ChevronRight className="h-4 w-4" />} className="min-h-[360px]">
            <EmptyState
              icon={<Folder className="h-8 w-8" />}
              title="暂无项目"
              action={
                <button className="rounded-lg bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--dash-primary-strong)]">
                  创建你的第一个项目
                </button>
              }
            />
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
    </div>
  );
}
