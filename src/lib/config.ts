export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api";

export const EVENT_NAME =
  process.env.NEXT_PUBLIC_EVENT_NAME ?? "OneBSJ Fun Run 2026";

export const ADMIN_TOKEN_STORAGE_KEY = "onebsj_admin_token";
