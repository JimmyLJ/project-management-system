import { Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { Workspace } from "./types";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

type WorkspaceSelectorProps = {
  workspaces: Workspace[];
  currentWorkspace?: Workspace;
  isLoading: boolean;
};

const getWorkspaceInitial = (workspace?: Workspace) => {
  if (!workspace?.name) return "W";
  return workspace.name.trim().slice(0, 1).toUpperCase();
};

export default function WorkspaceSelector({
  workspaces,
  currentWorkspace,
  isLoading,
}: WorkspaceSelectorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleWorkspaceSelect = (workspace: Workspace) => {
    if (workspace.slug === currentWorkspace?.slug) return;
    setIsOpen(false);
    navigate(`/w/${workspace.slug}`);
    queryClient.invalidateQueries();
  };

  const handleCreateSuccess = (workspace: Workspace) => {
    setIsCreateOpen(false);
    setIsOpen(false);
    navigate(`/w/${workspace.slug}`);
    queryClient.invalidateQueries();
  };

  const displayName = currentWorkspace?.name ?? (isLoading ? "加载中..." : "未选择工作区");
  const workspaceCount = `${workspaces.length} 个工作区`;
  const initials = getWorkspaceInitial(currentWorkspace);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 border-b border-[var(--dash-border)] px-6 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              {currentWorkspace?.logoUrl ? (
                <img
                  src={currentWorkspace.logoUrl}
                  alt={currentWorkspace.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {displayName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {workspaceCount}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="center" className="w-56">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            工作区
          </div>
          <div className="space-y-1">
            {workspaces.length === 0 ? (
              <div className="flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-400 dark:text-slate-500">
                暂无工作区
              </div>
            ) : (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => handleWorkspaceSelect(workspace)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {workspace.logoUrl ? (
                      <img
                        src={workspace.logoUrl}
                        alt={workspace.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getWorkspaceInitial(workspace)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {workspace.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      /{workspace.slug}
                    </div>
                  </div>
                  {currentWorkspace?.slug === workspace.slug && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              ))
            )}
          </div>
          <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
          <button
            type="button"
            onClick={() => {
              setIsCreateOpen(true);
              setIsOpen(false);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--dash-primary)] transition hover:bg-slate-50 hover:text-[var(--dash-primary-strong)] dark:hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            创建工作区
          </button>
        </PopoverContent>
      </Popover>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
