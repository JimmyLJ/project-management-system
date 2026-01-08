import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../login";
import { authKeys, signInWithEmail } from "~/features/auth/api";
import { useAuthSession } from "~/features/auth/hooks";
import { ApiError } from "~/lib/apiClient";

vi.mock("~/features/auth/hooks", () => ({
  useAuthSession: vi.fn(),
}));

vi.mock("~/features/auth/api", () => ({
  authKeys: {
    session: ["auth", "session"],
  },
  signInWithEmail: vi.fn(),
}));

const renderLogin = (state?: unknown) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[{ pathname: "/login", state }]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/projects" element={<div>Projects</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { queryClient, ...result };
};

describe("Login page", () => {
  const useAuthSessionMock = vi.mocked(useAuthSession);
  const signInWithEmailMock = vi.mocked(signInWithEmail);
  type AuthSessionQuery = ReturnType<typeof useAuthSession>;
  type SignInReturn = ReturnType<typeof signInWithEmail>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("显示加载状态", () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: true } as AuthSessionQuery);

    renderLogin();

    expect(screen.getByText("正在加载...")).toBeInTheDocument();
  });

  it("已登录时跳转到首页", async () => {
    useAuthSessionMock.mockReturnValue({
      data: { user: { id: "user-1" } },
      isLoading: false,
    } as AuthSessionQuery);

    renderLogin();

    expect(await screen.findByText("Home")).toBeInTheDocument();
  });

  it("邮箱格式错误时显示提示", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);

    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("邮箱地址"), "invalid");
    await user.type(screen.getByLabelText("密码"), "123456");
    await user.click(screen.getByRole("button", { name: "继续" }));

    expect(await screen.findByText("请输入有效的邮箱地址")).toBeInTheDocument();
  });

  it("密码不足时显示提示", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);

    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("邮箱地址"), "demo@example.com");
    await user.type(screen.getByLabelText("密码"), "123");
    await user.click(screen.getByRole("button", { name: "继续" }));

    expect(await screen.findByText("密码至少 6 位")).toBeInTheDocument();
  });

  it("提交后调用登录接口并进入加载态", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);

    let resolvePromise: (value: unknown) => void = () => {};
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    signInWithEmailMock.mockReturnValue(pendingPromise as SignInReturn);

    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("邮箱地址"), "demo@example.com");
    await user.type(screen.getByLabelText("密码"), "123456");
    await user.click(screen.getByRole("button", { name: "继续" }));

    expect(signInWithEmailMock).toHaveBeenCalled();
    expect(signInWithEmailMock.mock.calls[0]?.[0]).toEqual({
      email: "demo@example.com",
      password: "123456",
    });
    expect(screen.getByRole("button", { name: "登录中..." })).toBeDisabled();

    resolvePromise(null);
  });

  it("登录成功后刷新会话并跳转到目标页面", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);
    signInWithEmailMock.mockResolvedValue({ user: { id: "user-1" } } as Awaited<SignInReturn>);

    const { queryClient } = renderLogin({ from: { pathname: "/projects" } });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("邮箱地址"), "demo@example.com");
    await user.type(screen.getByLabelText("密码"), "123456");
    await user.click(screen.getByRole("button", { name: "继续" }));

    expect(await screen.findByText("Projects")).toBeInTheDocument();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: authKeys.session });
  });

  it("登录失败时显示接口错误信息", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);
    signInWithEmailMock.mockRejectedValue(new ApiError(401, "账号或密码错误", {}));

    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("邮箱地址"), "demo@example.com");
    await user.type(screen.getByLabelText("密码"), "123456");
    await user.click(screen.getByRole("button", { name: "继续" }));

    expect(await screen.findByText("账号或密码错误")).toBeInTheDocument();
  });
});
