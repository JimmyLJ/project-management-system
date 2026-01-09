import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateWorkspaceDialog } from "../CreateWorkspaceDialog";
import { useCreateWorkspace } from "../hooks";

vi.mock("../hooks", () => ({
  useCreateWorkspace: vi.fn(),
}));

const renderDialog = (props: Partial<Parameters<typeof CreateWorkspaceDialog>[0]> = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CreateWorkspaceDialog open={true} {...props} />
    </QueryClientProvider>,
  );
};

describe("CreateWorkspaceDialog", () => {
  const useCreateWorkspaceMock = vi.mocked(useCreateWorkspace);
  const mutateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useCreateWorkspaceMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateWorkspace>);
  });

  it("渲染对话框内容", () => {
    renderDialog();

    expect(screen.getByRole("heading", { name: "创建工作区" })).toBeInTheDocument();
    expect(screen.getByLabelText("名称")).toBeInTheDocument();
    expect(screen.getByLabelText("Slug")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "创建工作区" })).toBeInTheDocument();
  });

  it("name 过短显示错误", async () => {
    renderDialog();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("名称"), "T");
    await user.type(screen.getByLabelText("Slug"), "test");
    await user.click(screen.getByRole("button", { name: "创建工作区" }));

    expect(await screen.findByText("名称至少 2 个字符")).toBeInTheDocument();
  });

  it("slug 格式错误显示错误", async () => {
    renderDialog();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("名称"), "Test Workspace");
    await user.type(screen.getByLabelText("Slug"), "INVALID!");
    await user.click(screen.getByRole("button", { name: "创建工作区" }));

    expect(await screen.findByText("只能包含小写字母、数字和连字符")).toBeInTheDocument();
  });

  it("提交成功后调用 onSuccess 回调", async () => {
    const onSuccessMock = vi.fn();
    mutateMock.mockImplementation((_payload, options) => {
      options?.onSuccess?.({
        id: "1",
        name: "Test Workspace",
        slug: "test-ws",
        logoUrl: null,
        ownerId: "u1",
        createdAt: "2024-01-01",
      });
    });

    renderDialog({ onSuccess: onSuccessMock });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("名称"), "Test Workspace");
    await user.type(screen.getByLabelText("Slug"), "test-ws");
    await user.click(screen.getByRole("button", { name: "创建工作区" }));

    expect(mutateMock).toHaveBeenCalledWith(
      { name: "Test Workspace", slug: "test-ws" },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    expect(onSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "test-ws" }),
    );
  });

  it("closable=true 时显示关闭按钮", () => {
    renderDialog({ closable: true });

    expect(screen.getByRole("button", { name: "关闭" })).toBeInTheDocument();
  });

  it("closable=false 时不显示关闭按钮", () => {
    renderDialog({ closable: false });

    expect(screen.queryByRole("button", { name: "关闭" })).not.toBeInTheDocument();
  });

  it("加载状态时按钮禁用", () => {
    useCreateWorkspaceMock.mockReturnValue({
      mutate: mutateMock,
      isPending: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCreateWorkspace>);

    renderDialog();

    const button = screen.getByRole("button", { name: "创建中..." });
    expect(button).toBeDisabled();
  });
});
