const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const resolveSocketBaseUrl = (): string => {
  const base = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  if (base.startsWith("https://")) return base;
  if (base.startsWith("http://")) return base;
  return `http://${base}`;
};

export const resolveImageUrl = (path?: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = API_BASE_URL.replace("/api/v1", "");
  if (path.startsWith("/uploads")) return `${base}${path}`;
  if (path.startsWith("uploads/")) return `${base}/${path}`;
  // filename only
  return `${base}/uploads/${path}`;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    isFormData?: boolean;
  } = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string; [key: string]: any }> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("nego_token") : null;

  const reqHeaders: Record<string, string> = {
    ...headers,
  };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData && body && typeof body === "object") {
    reqHeaders["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: reqHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return {
        success: false,
        message: `Server returned non-JSON response (${res.status}). Is the backend running?`,
        error: "non_json_response",
      };
    }

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || data.errors?.[0] || "API Request Failed",
        error: data.message || "Failed",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: "Network error. Is the backend running on port 5000?",
      error: error.message,
    };
  }
}
