import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardLayout from "../DashboardLayout";
import { useCurrentWorkspace } from "~/features/workspace/hooks";

vi.mock("~/features/workspace/hooks", () => ({
  useCurrentWorkspace: vi.fn(),
}));

vi.mock("~/features/workspace/CreateWorkspaceDialog", () => ({
  CreateWorkspaceDialog: ({ open, closable }: { open: boolean; closable: boolean }) =>
    open ? <div data-testid="create-workspace-dialog" data-closable={closable}>创建工作区对话框</div> : null,
}));

vi.mock("~/features/dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("~/features/dashboard/Topbar", () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}));

const renderLayout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/w/test"]}>
        <Routes>
          <Route path="/w/:workspaceSlug" element={<DashboardLayout />}>
            <Route index element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("DashboardLayout", () => {
  const useCurrentWorkspaceMock = vi.mocked(useCurrentWorkspace);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("加载时不显示对话框", () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [],
      currentWorkspace: undefined,
      isLoading: true,
      workspaceSlug: "test",
    } as ReturnType<typeof useCurrentWorkspace>);

    renderLayout();

    expect(screen.queryByTestId("create-workspace-dialog")).not.toBeInTheDocument();
  });

  it("工作区列表为空时显示对话框", () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [],
      currentWorkspace: undefined,
      isLoading: false,
      workspaceSlug: "test",
    } as ReturnType<typeof useCurrentWorkspace>);

    renderLayout();

    const dialog = screen.getByTestId("create-workspace-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("data-closable", "false");
  });

  it("工作区列表非空时不显示对话框", () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [{ id: "1", name: "Test", slug: "test", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" }],
      currentWorkspace: { id: "1", name: "Test", slug: "test", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" },
      isLoading: false,
      workspaceSlug: "test",
    } as ReturnType<typeof useCurrentWorkspace>);

    renderLayout();

    expect(screen.queryByTestId("create-workspace-dialog")).not.toBeInTheDocument();
  });

  it("渲染布局组件", () => {
    useCurrentWorkspaceMock.mockReturnValue({
      workspaces: [{ id: "1", name: "Test", slug: "test", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" }],
      currentWorkspace: { id: "1", name: "Test", slug: "test", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" },
      isLoading: false,
      workspaceSlug: "test",
    } as ReturnType<typeof useCurrentWorkspace>);

    renderLayout();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("topbar")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});
