import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "./hooks";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

export default function WorkspaceGate() {
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, isLoading } = useCurrentWorkspace();
  const hasNoWorkspace = !isLoading && workspaces.length === 0;

  useEffect(() => {
    if (isLoading || !currentWorkspace) return;
    navigate(`/w/${currentWorkspace.slug}`, { replace: true });
  }, [currentWorkspace, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] transition-colors duration-300 dark:[--dash-bg:#0a0c10] dark:[--dash-card:#151a22] dark:[--dash-border:#262c38] dark:[--dash-muted:#9aa4b2] dark:[--dash-text:#e5e7eb] dark:[--dash-primary:#3b82f6] dark:[--dash-primary-strong:#2563eb] dark:[--dash-success:#22c55e] dark:[--dash-warning:#f59e0b] dark:[--dash-danger:#ef4444] dark:bg-[radial-gradient(circle_at_top,_#1a1d25_0%,_#0b0d12_55%,_#090a0f_100%)]">
      <CreateWorkspaceDialog
        open={hasNoWorkspace}
        closable={false}
        onSuccess={(workspace) => {
          navigate(`/w/${workspace.slug}`, { replace: true });
        }}
      />
    </div>
  );
}
