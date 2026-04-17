"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import type { AdminSummary } from "@/lib/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon, ListIcon } from "@/components/ui/Icons";
import { LinkButton } from "@/components/ui/LinkButton";
import { Message } from "@/components/ui/Message";

export function AdminDashboardView() {
  const { token, isChecking, logout } = useAdminAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    async function loadSummary() {
      setError(null);
      setIsLoading(true);
      try {
        setSummary(await api.getAdminSummary(authToken));
      } catch (err) {
        const message =
          err instanceof ApiError || err instanceof Error
            ? err.message
            : "Unable to load dashboard.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadSummary();
  }, [token]);

  if (isChecking) return <div className="loading-block">Checking admin session...</div>;

  return (
    <AdminShell
      title="Dashboard"
      onLogout={logout}
      actions={
        <LinkButton href="/admin/registrations" icon={<ListIcon />} variant="primary">
          Manage registrations
        </LinkButton>
      }
    >
      {error ? (
        <Message tone="error" title="Dashboard unavailable">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading dashboard...</div> : null}

      <div className="metric-grid">
        <Card className="metric-card">
          <span>Total registrations</span>
          <strong>{summary?.total_registrations ?? 0}</strong>
        </Card>
        <Card className="metric-card paid">
          <span>Paid</span>
          <strong>{summary?.paid ?? 0}</strong>
        </Card>
        <Card className="metric-card pending">
          <span>Pending</span>
          <strong>{summary?.pending ?? 0}</strong>
        </Card>
        <Card className="metric-card failed">
          <span>Failed / Cancelled</span>
          <strong>{(summary?.failed ?? 0) + (summary?.cancelled ?? 0)}</strong>
        </Card>
      </div>

      <Card className="quick-card">
        <div>
          <p className="eyebrow">Quick action</p>
          <h2>Review runner registrations</h2>
          <p>Search, filter, and open runner records for payment and bib review.</p>
        </div>
        <LinkButton
          href="/admin/registrations"
          icon={<ArrowRightIcon />}
          variant="secondary"
        >
          Open list
        </LinkButton>
      </Card>
    </AdminShell>
  );
}
