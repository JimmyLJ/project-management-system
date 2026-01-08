import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RequireAuth from "../RequireAuth";
import { useAuthSession } from "../hooks";

vi.mock("../hooks", () => ({
  useAuthSession: vi.fn(),
}));

const LoginSpy = () => {
  const location = useLocation() as { state?: { from?: { pathname?: string } } };
  return <div>Login {location.state?.from?.pathname ?? "none"}</div>;
};

describe("RequireAuth", () => {
  const useAuthSessionMock = vi.mocked(useAuthSession);
  type AuthSessionQuery = ReturnType<typeof useAuthSession>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("加载中时显示占位", () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: true } as AuthSessionQuery);

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <div>Protected</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("未登录时跳转到登录页并携带来源路径", async () => {
    useAuthSessionMock.mockReturnValue({ data: null, isLoading: false } as AuthSessionQuery);

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route path="/login" element={<LoginSpy />} />
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <div>Protected</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Login /projects")).toBeInTheDocument();
  });

  it("已登录时渲染子内容", () => {
    useAuthSessionMock.mockReturnValue(
      { data: { user: { id: "user-1" } }, isLoading: false } as AuthSessionQuery,
    );

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <div>Protected</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected")).toBeInTheDocument();
  });
});
