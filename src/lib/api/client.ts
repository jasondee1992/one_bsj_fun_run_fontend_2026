import { API_BASE_URL } from "@/lib/config";
import type {
  AdminLoginResponse,
  AdminSummary,
  ApiEnvelope,
  PaginatedRegistrations,
  PaymentSession,
  Registration,
  RegistrationFilters,
  RegistrationPayload,
} from "@/lib/types";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return response.text();
  }

  return response.json();
}

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === "object") {
    const envelope = payload as ApiEnvelope<T>;
    return (
      envelope.data ??
      envelope.registration ??
      envelope.registrations ??
      envelope.item ??
      envelope.items ??
      (payload as T)
    );
  }

  return payload as T;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, payload);
  }

  return unwrap<T>(payload as ApiEnvelope<T> | T);
}

function normalizeList(payload: unknown, filters: RegistrationFilters): PaginatedRegistrations {
  if (Array.isArray(payload)) {
    return {
      items: payload as Registration[],
      total: payload.length,
      page: filters.page ?? 1,
      page_size: filters.page_size ?? payload.length,
    };
  }

  const value = payload as Partial<PaginatedRegistrations> & {
    data?: Registration[];
    results?: Registration[];
    registrations?: Registration[];
  };

  const items = value.items ?? value.data ?? value.results ?? value.registrations ?? [];

  return {
    items,
    total: value.total ?? items.length,
    page: value.page ?? filters.page ?? 1,
    page_size: value.page_size ?? filters.page_size ?? 20,
  };
}

export const api = {
  createRegistration(payload: RegistrationPayload) {
    return request<Registration>("/registrations", {
      method: "POST",
      body: payload,
    });
  },

  getRegistration(id: string | number) {
    return request<Registration>(`/registrations/${id}`);
  },

  createPaymentSession(registrationId: string | number) {
    return request<PaymentSession>(`/payments/${registrationId}/create`, {
      method: "POST",
    });
  },

  getPaymentSession(registrationId: string | number) {
    return request<PaymentSession>(`/payments/${registrationId}`);
  },

  simulatePaymentSuccess(registrationId: string | number) {
    return request<PaymentSession>(`/payments/${registrationId}/simulate-paid`, {
      method: "POST",
    });
  },

  adminLogin(username: string, password: string) {
    return request<AdminLoginResponse>("/admin/login", {
      method: "POST",
      body: { username, password },
    });
  },

  async getAdminSummary(token: string) {
    const payload = await request<AdminSummary | Record<string, number>>(
      "/admin/dashboard/summary",
      { token },
    );

    return {
      total_registrations:
        "total_registrations" in payload
          ? Number(payload.total_registrations)
          : Number(payload.total ?? 0),
      paid: Number(payload.paid ?? 0),
      pending: Number(payload.pending ?? 0),
      failed: Number(payload.failed ?? 0),
      cancelled: Number(payload.cancelled ?? 0),
    };
  },

  async getAdminRegistrations(token: string, filters: RegistrationFilters = {}) {
    const statusMap: Record<string, string> = {
      pending: "PENDING_PAYMENT",
      paid: "PAID",
      failed: "PAYMENT_FAILED",
      cancelled: "CANCELLED",
    };

    const payload = await request<unknown>("/admin/registrations", {
      token,
      query: {
        search: filters.search,
        status: filters.payment_status ? statusMap[filters.payment_status] : undefined,
        category: filters.race_category,
        page: filters.page,
        page_size: filters.page_size,
      },
    });

    return normalizeList(payload, filters);
  },

  getAdminRegistration(token: string, id: string | number) {
    return request<Registration>(`/admin/registrations/${id}`, { token });
  },
};
