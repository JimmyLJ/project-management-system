import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WorkspaceGate from "../WorkspaceGate";
import { useCurrentWorkspace } from "../hooks";
import type { Workspace } from "../types";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../hooks", () => ({
  useCurrentWorkspace: vi.fn(),
}));

vi.mock("../CreateWorkspaceDialog", () => ({
  CreateWorkspaceDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="create-workspace-dialog">Create Workspace</div> : null,
}));

const workspace: Workspace = {
  id: "1",
  name: "Acme",
  slug: "acme",
  logoUrl: null,
  ownerId: "u1",
  createdAt: "2024-01-01",
};

describe("WorkspaceGate", () => {
  const useCurrentWorkspaceMock = vi.mocked(useCurrentWorkspace);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("已有工作区时跳转到默认工作区", async () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [workspace],
      currentWorkspace: workspace,
      isLoading: false,
    } as ReturnType<typeof useCurrentWorkspace>);

    render(<WorkspaceGate />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/w/acme", { replace: true });
    });
  });

  it("没有工作区时显示创建对话框", () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [],
      currentWorkspace: undefined,
      isLoading: false,
    } as ReturnType<typeof useCurrentWorkspace>);

    render(<WorkspaceGate />);

    expect(screen.getByTestId("create-workspace-dialog")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
