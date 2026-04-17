"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { EVENT_NAME } from "@/lib/config";
import { fullName, paymentStatusOf, registrationIdOf } from "@/lib/format";
import type { Registration } from "@/lib/types";
import { RegistrationSummary } from "@/components/status/RegistrationSummary";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshIcon } from "@/components/ui/Icons";
import { Message } from "@/components/ui/Message";

export function PendingPaymentView({ registrationId }: { registrationId: string }) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRegistration = useCallback(async (refresh = false) => {
    setError(null);
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await api.getRegistration(registrationId);
      setRegistration(data);
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to load registration.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [registrationId]);

  useEffect(() => {
    loadRegistration();
  }, [loadRegistration]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const status = paymentStatusOf(registration);
      if (status !== "paid") {
        loadRegistration(true);
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [loadRegistration, registration]);

  const status = paymentStatusOf(registration);

  return (
    <main className="page-shell narrow">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Payment pending</p>
          <h1>Complete your registration payment</h1>
        </div>
        <Button
          variant="secondary"
          icon={<RefreshIcon />}
          isLoading={isRefreshing}
          onClick={() => loadRegistration(true)}
        >
          Refresh status
        </Button>
      </div>

      {error ? (
        <Message tone="error" title="Could not load registration">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading registration...</div> : null}

      {registration ? (
        <>
          <RegistrationSummary registration={registration} compact />

          <Card className="payment-card">
            <div className="summary-topline">
              <div>
                <p className="eyebrow">Payment status</p>
                <h2>{fullName(registration)}</h2>
              </div>
              <Badge status={status} />
            </div>

            <div className="qr-placeholder" aria-label="Payment QR placeholder">
              <span>QR</span>
              <p>Payment QR or payment provider instructions will appear here.</p>
            </div>

            <div className="payment-instructions">
              <h2>Payment instructions</h2>
              <p>
                Pay using the official {EVENT_NAME} payment channel. Your
                registration will remain pending until the backend confirms the
                payment and assigns a bib number.
              </p>
              <p>
                Keep your registration ID:{" "}
                <strong>{registrationIdOf(registration)}</strong>
              </p>
            </div>

            {status === "paid" ? (
              <Message tone="success" title="Payment confirmed">
                <Link href={`/status/${registrationId}`}>
                  View your confirmed registration and bib number.
                </Link>
              </Message>
            ) : (
              <Message tone="warning" title="Not confirmed yet">
                Registration is confirmed only after successful payment.
              </Message>
            )}
          </Card>
        </>
      ) : null}
    </main>
  );
}
