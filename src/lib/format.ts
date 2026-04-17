import type { PaymentStatus, Registration } from "@/lib/types";

export function fullName(registration?: Partial<Registration> | null) {
  if (!registration) return "Unknown runner";

  const parts = [
    registration.first_name,
    registration.middle_name,
    registration.last_name,
    registration.suffix,
  ].filter(Boolean);

  return registration.full_name || parts.join(" ") || "Unknown runner";
}

export function registrationIdOf(registration: Partial<Registration>) {
  return registration.id ?? registration.registration_id ?? registration.reference_number;
}

export function paymentStatusOf(registration?: Partial<Registration> | null) {
  const raw =
    registration?.payment_status ??
    registration?.status ??
    registration?.payment?.status ??
    registration?.payment_details?.status ??
    "unknown";

  const value = String(raw).toUpperCase();

  if (value === "AWAITING_PAYMENT") return "awaiting_payment";
  if (value === "PENDING_PAYMENT" || value === "PENDING") return "pending";
  if (value === "PAID") return "paid";
  if (value === "PAYMENT_FAILED" || value === "FAILED") return "failed";
  if (value === "EXPIRED") return "expired";
  if (value === "CANCELLED" || value === "CANCELED") return "cancelled";

  return "unknown" as PaymentStatus;
}

export function smsStatusOf(registration?: Partial<Registration> | null) {
  if (registration?.sms_confirmation_status) {
    return String(registration.sms_confirmation_status).toLowerCase();
  }

  if (registration?.sms_sent) return "sent";
  return "not sent";
}

export function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
  }).format(date);
}

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number") return "Not available";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}
