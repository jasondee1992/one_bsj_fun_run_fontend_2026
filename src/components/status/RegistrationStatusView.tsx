"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { paymentStatusOf } from "@/lib/format";
import type { Registration } from "@/lib/types";
import { RegistrationSummary } from "@/components/status/RegistrationSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshIcon } from "@/components/ui/Icons";
import { Message } from "@/components/ui/Message";

export function RegistrationStatusView({ registrationId }: { registrationId: string }) {
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
          : "Unable to load registration status.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [registrationId]);

  useEffect(() => {
    loadRegistration();
  }, [loadRegistration]);

  const status = paymentStatusOf(registration);

  return (
    <main className="page-shell narrow">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Registration status</p>
          <h1>Confirmation details</h1>
        </div>
        <Button
          variant="secondary"
          icon={<RefreshIcon />}
          isLoading={isRefreshing}
          onClick={() => loadRegistration(true)}
        >
          Refresh
        </Button>
      </div>

      {error ? (
        <Message tone="error" title="Could not load status">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading status...</div> : null}

      {registration ? (
        <>
          <RegistrationSummary registration={registration} />
          <Card className="confirmation-card">
            {status === "paid" ? (
              <Message tone="success" title="Registration confirmed">
                Your payment is confirmed. Present your bib number and valid ID
                at race kit claiming.
              </Message>
            ) : (
              <Message tone="warning" title="Registration not confirmed">
                Payment is still {status}. Refresh this page after payment is
                processed.
              </Message>
            )}
          </Card>
        </>
      ) : null}
    </main>
  );
}
