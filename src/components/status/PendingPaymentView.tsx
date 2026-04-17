"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { api, ApiError } from "@/lib/api/client";
import { EVENT_NAME, PAYMENT_PROVIDER } from "@/lib/config";
import {
  formatCurrency,
  formatDate,
  fullName,
  paymentStatusOf,
  registrationIdOf,
} from "@/lib/format";
import type { PaymentSession, Registration } from "@/lib/types";
import { RegistrationSummary } from "@/components/status/RegistrationSummary";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshIcon } from "@/components/ui/Icons";
import { LinkButton } from "@/components/ui/LinkButton";
import { Message } from "@/components/ui/Message";

function normalizeSessionStatus(session?: PaymentSession | null) {
  return paymentStatusOf({
    payment_status: session?.payment_status,
    status: session?.payment_status,
  });
}

export function PendingPaymentView({ registrationId }: { registrationId: string }) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const loadPaymentFlow = useCallback(async (refresh = false) => {
    setError(null);
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const registrationData = await api.getRegistration(registrationId);
      const sessionData = refresh
        ? await api.getPaymentSession(registrationId)
        : await api.createPaymentSession(registrationId);

      setRegistration(registrationData);
      setPaymentSession(sessionData);
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to load payment session.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [registrationId]);

  async function simulatePayment() {
    setError(null);
    setIsSimulating(true);
    try {
      const session = await api.simulatePaymentSuccess(registrationId);
      const registrationData = await api.getRegistration(registrationId);
      setPaymentSession(session);
      setRegistration(registrationData);
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to simulate payment success.";
      setError(message);
    } finally {
      setIsSimulating(false);
    }
  }

  useEffect(() => {
    loadPaymentFlow();
  }, [loadPaymentFlow]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const status = normalizeSessionStatus(paymentSession);
      if (status !== "paid" && status !== "failed" && status !== "expired") {
        loadPaymentFlow(true);
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [loadPaymentFlow, paymentSession]);

  const sessionStatus = normalizeSessionStatus(paymentSession);
  const registrationStatus = paymentStatusOf(registration);
  const status = sessionStatus !== "unknown" ? sessionStatus : registrationStatus;
  const isPaid = status === "paid";
  const isTerminalFailure = status === "failed" || status === "expired" || status === "cancelled";
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="page-shell narrow">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Payment</p>
          <h1>{isPaid ? "Registration confirmed" : "Complete your payment"}</h1>
        </div>
        <Button
          variant="secondary"
          icon={<RefreshIcon />}
          isLoading={isRefreshing}
          onClick={() => loadPaymentFlow(true)}
        >
          Refresh status
        </Button>
      </div>

      {error ? (
        <Message tone="error" title="Payment flow unavailable">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading payment session...</div> : null}

      {registration && paymentSession ? (
        <>
          <RegistrationSummary registration={registration} compact />

          <Card className="payment-card">
            <div className="payment-layout">
              <section className="qr-panel" aria-label="Payment QR code">
                <div className="qr-surface">
                  {paymentSession.qr_code_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={paymentSession.qr_code_url}
                      alt={`Payment QR for ${paymentSession.payment_reference}`}
                    />
                  ) : paymentSession.qr_code_payload ? (
                    <QRCodeSVG
                      value={paymentSession.qr_code_payload}
                      size={230}
                      marginSize={2}
                      level="M"
                    />
                  ) : (
                    <div className="qr-empty">
                      <strong>No QR available</strong>
                      <span>Refresh the session or use the payment link.</span>
                    </div>
                  )}
                </div>
                <div className="qr-caption">
                  <span>{paymentSession.provider.toUpperCase()}</span>
                  <strong>{paymentSession.payment_reference}</strong>
                </div>
              </section>

              <section className="payment-detail-panel">
                <div className="summary-topline">
                  <div>
                    <p className="eyebrow">Payment status</p>
                    <h2>{fullName(registration)}</h2>
                  </div>
                  <Badge status={status} />
                </div>

                <dl className="payment-facts">
                  <div>
                    <dt>Amount</dt>
                    <dd>{formatCurrency(paymentSession.amount)}</dd>
                  </div>
                  <div>
                    <dt>Provider</dt>
                    <dd>{paymentSession.provider}</dd>
                  </div>
                  <div>
                    <dt>Method</dt>
                    <dd>{paymentSession.payment_method}</dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>{formatDate(paymentSession.expires_at)}</dd>
                  </div>
                  <div>
                    <dt>Registration ID</dt>
                    <dd>{registrationIdOf(registration)}</dd>
                  </div>
                  <div>
                    <dt>Race / Shirt</dt>
                    <dd>
                      {paymentSession.race_category} / {paymentSession.shirt_size}
                    </dd>
                  </div>
                </dl>

                <div className="payment-instructions">
                  <h2>Payment instructions</h2>
                  {isPaid ? (
                    <p>
                      Payment is confirmed. Your registration is now confirmed
                      for {EVENT_NAME}.
                    </p>
                  ) : isTerminalFailure ? (
                    <p>
                      This payment session is {status}. Create or refresh your
                      payment session before paying.
                    </p>
                  ) : (
                    <p>
                      Scan the QR code using the configured {PAYMENT_PROVIDER}
                      sandbox flow. Keep this page open and refresh after payment.
                    </p>
                  )}
                </div>

                <div className="payment-actions">
                  {paymentSession.payment_url ? (
                    <LinkButton href={paymentSession.payment_url} variant="secondary">
                      Open payment page
                    </LinkButton>
                  ) : null}
                  {isDevelopment && !isPaid ? (
                    <Button
                      variant="primary"
                      isLoading={isSimulating}
                      onClick={simulatePayment}
                    >
                      Simulate payment success
                    </Button>
                  ) : null}
                </div>
              </section>
            </div>

            {isPaid ? (
              <Message tone="success" title="Payment confirmed">
                Bib number: <strong>{paymentSession.bib_number ?? registration.bib_number}</strong>.
                {" "}
                SMS status: <strong>{paymentSession.sms_status}</strong>.{" "}
                <Link href={`/status/${registrationId}`}>
                  View confirmation details.
                </Link>
              </Message>
            ) : isTerminalFailure ? (
              <Message tone="error" title="Payment not completed">
                This registration is not confirmed because payment is {status}.
              </Message>
            ) : (
              <Message tone="warning" title="Awaiting payment">
                Registration is confirmed only after the backend marks this
                payment as paid.
              </Message>
            )}
          </Card>
        </>
      ) : null}
    </main>
  );
}
