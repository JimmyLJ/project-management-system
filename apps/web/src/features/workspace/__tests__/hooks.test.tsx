import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMyWorkspaces, useCreateWorkspace } from "../hooks";
import { getMyWorkspaces, createWorkspace, workspaceKeys } from "../api";
import type { ReactNode } from "react";

vi.mock("../api", () => ({
  workspaceKeys: {
    all: ["workspaces"],
    me: ["workspaces", "me"],
  },
  getMyWorkspaces: vi.fn(),
  createWorkspace: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

describe("workspace hooks", () => {
  const getMyWorkspacesMock = vi.mocked(getMyWorkspaces);
  const createWorkspaceMock = vi.mocked(createWorkspace);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useMyWorkspaces", () => {
    it("调用正确的 API", async () => {
      const mockWorkspaces = [
        { id: "1", name: "Test", slug: "test", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" },
      ];
      getMyWorkspacesMock.mockResolvedValue(mockWorkspaces);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useMyWorkspaces(), { wrapper: Wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getMyWorkspacesMock).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockWorkspaces);
    });
  });

  describe("useCreateWorkspace", () => {
    it("创建成功后 invalidate 查询", async () => {
      const newWorkspace = { id: "2", name: "New", slug: "new", logoUrl: null, ownerId: "u1", createdAt: "2024-01-01" };
      createWorkspaceMock.mockResolvedValue(newWorkspace);

      const { Wrapper, queryClient } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateWorkspace(), { wrapper: Wrapper });

      result.current.mutate({ name: "New", slug: "new" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(createWorkspaceMock).toHaveBeenCalledWith({ name: "New", slug: "new" });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: workspaceKeys.me });
    });
  });
});
