import { Users } from "lucide-react";
import EmptyState from "~/features/dashboard/EmptyState";
import SectionCard from "~/features/dashboard/SectionCard";

export default function Teams() {
  return (
    <div className="space-y-8">
      <SectionCard title="团队">
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="暂无团队"
          description="创建一个团队并邀请成员加入"
        />
      </SectionCard>
    </div>
  );
}
