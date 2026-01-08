import { Folder } from "lucide-react";
import EmptyState from "~/features/dashboard/EmptyState";
import SectionCard from "~/features/dashboard/SectionCard";

export default function Projects() {
  return (
    <div className="space-y-8">
      <SectionCard title="项目">
        <EmptyState
          icon={<Folder className="h-8 w-8" />}
          title="暂无项目"
          description="创建一个新项目开始协作"
        />
      </SectionCard>
    </div>
  );
}
