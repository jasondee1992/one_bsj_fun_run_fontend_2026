"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { formatDate, paymentStatusOf, smsStatusOf } from "@/lib/format";
import type { Registration } from "@/lib/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { RegistrationSummary } from "@/components/status/RegistrationSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RefreshIcon } from "@/components/ui/Icons";
import { LinkButton } from "@/components/ui/LinkButton";
import { Message } from "@/components/ui/Message";

export function AdminRegistrationDetailView({
  registrationId,
}: {
  registrationId: string;
}) {
  const { token, isChecking, logout } = useAdminAuth();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRegistration = useCallback(async (refresh = false) => {
    if (!token) return;

    setError(null);
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      setRegistration(await api.getAdminRegistration(token, registrationId));
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
  }, [registrationId, token]);

  useEffect(() => {
    loadRegistration();
  }, [loadRegistration]);

  if (isChecking) return <div className="loading-block">Checking admin session...</div>;

  return (
    <AdminShell
      title="Registration detail"
      eyebrow={`Registration ${registrationId}`}
      onLogout={logout}
      actions={
        <div className="action-row">
          <LinkButton href="/admin/registrations" variant="secondary">
            Back to list
          </LinkButton>
          <Button
            variant="secondary"
            icon={<RefreshIcon />}
            isLoading={isRefreshing}
            onClick={() => loadRegistration(true)}
          >
            Refresh
          </Button>
        </div>
      }
    >
      {error ? (
        <Message tone="error" title="Registration unavailable">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading registration...</div> : null}

      {registration ? (
        <>
          <RegistrationSummary registration={registration} />
          <Card className="admin-detail-card">
            <div className="subsection">
              <h2>Runner information</h2>
              <dl className="detail-grid">
                <div>
                  <dt>Birthday</dt>
                  <dd>{formatDate(registration.birthday)}</dd>
                </div>
                <div>
                  <dt>Sex</dt>
                  <dd>{registration.sex}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{registration.address}</dd>
                </div>
                <div>
                  <dt>City / Province</dt>
                  <dd>
                    {[registration.city, registration.province]
                      .filter(Boolean)
                      .join(", ") || "Not available"}
                  </dd>
                </div>
                <div>
                  <dt>Emergency contact</dt>
                  <dd>
                    {registration.emergency_contact_name} /{" "}
                    {registration.emergency_contact_number}
                  </dd>
                </div>
                <div>
                  <dt>Medical conditions</dt>
                  <dd>{registration.medical_conditions || "None provided"}</dd>
                </div>
                <div>
                  <dt>Notes</dt>
                  <dd>{registration.notes || "None provided"}</dd>
                </div>
              </dl>
            </div>

            <div className="subsection">
              <h2>Admin review</h2>
              <dl className="detail-grid">
                <div>
                  <dt>Payment status</dt>
                  <dd>{paymentStatusOf(registration)}</dd>
                </div>
                <div>
                  <dt>Bib number</dt>
                  <dd>{registration.bib_number ?? "Not assigned"}</dd>
                </div>
                <div>
                  <dt>SMS confirmation status</dt>
                  <dd>{smsStatusOf(registration)}</dd>
                </div>
                <div>
                  <dt>Waiver accepted</dt>
                  <dd>{registration.waiver_accepted ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Privacy consent accepted</dt>
                  <dd>{registration.privacy_consent_accepted ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatDate(registration.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </Card>
        </>
      ) : null}
    </AdminShell>
  );
}
