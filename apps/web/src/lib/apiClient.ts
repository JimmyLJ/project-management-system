export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = RequestInit & {
  json?: unknown;
};

const parseResponse = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
};

export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}) => {
  const { json, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data ? String(data.message) : response.statusText;
    throw new ApiError(response.status, message || "Request failed", data);
  }

  return data as T;
};
