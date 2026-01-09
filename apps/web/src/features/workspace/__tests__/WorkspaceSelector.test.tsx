import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WorkspaceSelector from "../WorkspaceSelector";
import type { Workspace } from "../types";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../CreateWorkspaceDialog", () => ({
  CreateWorkspaceDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="create-workspace-dialog">Create Workspace</div> : null,
}));

const workspaces: Workspace[] = [
  { id: "1", name: "Acme", slug: "acme", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" },
  { id: "2", name: "Beta", slug: "beta", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" },
];

const renderSelector = ({
  workspacesOverride = workspaces,
  currentWorkspace = workspaces[0],
  isLoading = false,
}: {
  workspacesOverride?: Workspace[];
  currentWorkspace?: Workspace | null;
  isLoading?: boolean;
} = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const resolvedWorkspace = currentWorkspace ?? undefined;

  return render(
    <QueryClientProvider client={queryClient}>
      <WorkspaceSelector
        workspaces={workspacesOverride}
        currentWorkspace={resolvedWorkspace}
        isLoading={isLoading}
      />
    </QueryClientProvider>,
  );
};

describe("WorkspaceSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("打开泡泡窗后显示工作区列表", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole("button", { name: /Acme/ }));

    expect(screen.getByText("工作区")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("泡泡窗内不显示设置入口", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole("button", { name: /Acme/ }));

    expect(screen.queryByText("设置")).not.toBeInTheDocument();
  });

  it("点击工作区后跳转到对应路由", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole("button", { name: /Acme/ }));
    await user.click(screen.getByRole("button", { name: /Beta/ }));

    expect(navigateMock).toHaveBeenCalledWith("/w/beta");
  });

  it("点击创建工作区后打开对话框", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole("button", { name: /Acme/ }));
    await user.click(screen.getByRole("button", { name: "创建工作区" }));

    expect(screen.getByTestId("create-workspace-dialog")).toBeInTheDocument();
  });

  it("没有工作区时显示空状态", async () => {
    const user = userEvent.setup();
    renderSelector({ workspacesOverride: [], currentWorkspace: null });

    const trigger = screen.getByText("未选择工作区").closest("button");
    expect(trigger).toBeTruthy();
    await user.click(trigger as HTMLButtonElement);

    expect(screen.getByText("暂无工作区")).toBeInTheDocument();
  });
});
