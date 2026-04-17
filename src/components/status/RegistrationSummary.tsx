import { EVENT_NAME } from "@/lib/config";
import {
  formatCurrency,
  formatDate,
  fullName,
  paymentStatusOf,
  smsStatusOf,
} from "@/lib/format";
import type { Registration } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function RegistrationSummary({
  registration,
  compact = false,
}: {
  registration: Registration;
  compact?: boolean;
}) {
  const payment =
    registration.payment ??
    registration.payment_details ??
    registration.payments?.[0] ??
    null;
  const paymentStatus = paymentStatusOf(registration);

  return (
    <Card className={compact ? "summary-card compact" : "summary-card"}>
      <div className="summary-topline">
        <div>
          <p className="eyebrow">{EVENT_NAME}</p>
          <h1>{fullName(registration)}</h1>
        </div>
        <Badge status={paymentStatus} />
      </div>

      {paymentStatus === "paid" && registration.bib_number ? (
        <div className="bib-callout">
          <span>Bib number</span>
          <strong>{registration.bib_number}</strong>
        </div>
      ) : null}

      <dl className="detail-grid">
        <div>
          <dt>Registration ID</dt>
          <dd>{registration.id ?? registration.registration_id}</dd>
        </div>
        <div>
          <dt>Reference</dt>
          <dd>
            {registration.payment_reference ??
              registration.reference_number ??
              registration.registration_number ??
              "Not available"}
          </dd>
        </div>
        <div>
          <dt>Race category</dt>
          <dd>{registration.race_category || "Not available"}</dd>
        </div>
        <div>
          <dt>Shirt size</dt>
          <dd>{registration.shirt_size || "Not available"}</dd>
        </div>
        <div>
          <dt>Payment status</dt>
          <dd>{paymentStatus}</dd>
        </div>
        <div>
          <dt>SMS status</dt>
          <dd>{smsStatusOf(registration)}</dd>
        </div>
        {!compact ? (
          <>
            <div>
              <dt>Email</dt>
              <dd>{registration.email}</dd>
            </div>
            <div>
              <dt>Cellphone</dt>
              <dd>{registration.cellphone_number}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(registration.created_at)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(registration.updated_at)}</dd>
            </div>
          </>
        ) : null}
      </dl>

      {!compact && payment ? (
        <div className="subsection">
          <h2>Payment details</h2>
          <dl className="detail-grid">
            <div>
              <dt>Payment reference</dt>
              <dd>
                {payment.payment_reference ??
                  payment.reference_number ??
                  registration.payment_reference ??
                  "Not available"}
              </dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{payment.provider_name ?? payment.provider ?? "Not available"}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>{formatCurrency(payment.amount)}</dd>
            </div>
            <div>
              <dt>Paid at</dt>
              <dd>{formatDate(payment.paid_at)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </Card>
  );
}
