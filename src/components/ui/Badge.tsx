import { paymentStatusOf } from "@/lib/format";
import type { PaymentStatus, Registration } from "@/lib/types";

type BadgeProps = {
  status?: PaymentStatus | string | null;
  registration?: Partial<Registration> | null;
};

export function Badge({ status, registration }: BadgeProps) {
  const value = String(status ?? paymentStatusOf(registration) ?? "unknown").toLowerCase();

  return <span className={`status-chip status-${value}`}>{value}</span>;
}
