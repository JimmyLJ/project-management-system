import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "../DashboardPage";
import { useProjects } from "~/features/projects/hooks";
import { useNavigate } from "react-router-dom";

vi.mock("~/features/projects/CreateProjectDialog", () => ({
  CreateProjectDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="create-project-dialog">
        <button type="button" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("~/features/projects/hooks", () => ({
  useProjects: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("~/features/workspace/hooks", () => ({
  useCurrentWorkspace: () => ({
    currentWorkspace: {
      id: "workspace-1",
      name: "测试工作区",
      slug: "test",
      logoUrl: null,
      ownerId: "user-1",
      createdAt: "2024-01-01",
    },
    workspaces: [],
    isLoading: false,
    workspaceSlug: "test",
  }),
}));

describe("DashboardPage", () => {
  const useProjectsMock = vi.mocked(useProjects);
  const useNavigateMock = vi.mocked(useNavigate);

  const makeProject = (index: number) => ({
    id: `project-${index}`,
    workspaceId: "workspace-1",
    name: `项目 ${index}`,
    description: `描述 ${index}`,
    status: "planning",
    priority: "medium",
    startDate: "2026-01-01",
    endDate: "2026-02-01",
    memberCount: index,
    createdBy: "user-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  });

  it("点击创建入口后打开对话框", async () => {
    useNavigateMock.mockReturnValue(vi.fn());
    useProjectsMock.mockReturnValue({ data: [], isLoading: false } as ReturnType<typeof useProjects>);
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByRole("button", { name: "新建项目" }));
    expect(screen.getByTestId("create-project-dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByTestId("create-project-dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "创建你的第一个项目" }));
    expect(screen.getByTestId("create-project-dialog")).toBeInTheDocument();
  });

  it("项目概览最多展示 3 个项目", () => {
    useNavigateMock.mockReturnValue(vi.fn());
    useProjectsMock.mockReturnValue({
      data: [makeProject(1), makeProject(2), makeProject(3), makeProject(4)],
      isLoading: false,
    } as ReturnType<typeof useProjects>);

    render(<DashboardPage />);

    expect(screen.getByText("项目 1")).toBeInTheDocument();
    expect(screen.getByText("项目 2")).toBeInTheDocument();
    expect(screen.getByText("项目 3")).toBeInTheDocument();
    expect(screen.queryByText("项目 4")).not.toBeInTheDocument();
  });

  it("点击查看全部跳转到项目页", async () => {
    const navigateSpy = vi.fn();
    useNavigateMock.mockReturnValue(navigateSpy);
    useProjectsMock.mockReturnValue({ data: [makeProject(1)], isLoading: false } as ReturnType<typeof useProjects>);

    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByRole("button", { name: "查看全部" }));
    expect(navigateSpy).toHaveBeenCalledWith("/w/test/projects");
  });
});
