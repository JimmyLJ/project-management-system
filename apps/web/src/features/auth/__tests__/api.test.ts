import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSession, signInWithEmail } from "../api";
import { apiRequest, ApiError } from "~/lib/apiClient";

vi.mock("~/lib/apiClient", async () => {
  const actual = await vi.importActual<typeof import("~/lib/apiClient")>("~/lib/apiClient");
  return {
    ...actual,
    apiRequest: vi.fn(),
  };
});

describe("auth api", () => {
  const apiRequestMock = vi.mocked(apiRequest);

  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("getSession 遇到 401 时返回 null", async () => {
    apiRequestMock.mockRejectedValue(new ApiError(401, "Unauthorized", {}));

    await expect(getSession()).resolves.toBeNull();
  });

  it("getSession 遇到非 401 错误时抛出异常", async () => {
    apiRequestMock.mockRejectedValue(new ApiError(500, "Server error", {}));

    await expect(getSession()).rejects.toBeInstanceOf(ApiError);
  });

  it("signInWithEmail 使用正确的请求参数", async () => {
    apiRequestMock.mockResolvedValue({ user: { id: "user-1" } });

    await signInWithEmail({ email: "demo@example.com", password: "secret123" });

    expect(apiRequestMock).toHaveBeenCalledWith("/api/auth/sign-in/email", {
      method: "POST",
      json: { email: "demo@example.com", password: "secret123" },
    });
  });
});
