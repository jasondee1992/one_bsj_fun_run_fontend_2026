"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import {
  formatDate,
  fullName,
  paymentStatusOf,
  registrationIdOf,
} from "@/lib/format";
import type { PaginatedRegistrations } from "@/lib/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/Icons";
import { Message } from "@/components/ui/Message";

const pageSize = 20;

export function AdminRegistrationsListView() {
  const { token, isChecking, logout } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [raceCategory, setRaceCategory] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedRegistrations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const authToken = token;

    async function loadRegistrations() {
      setError(null);
      setIsLoading(true);
      try {
        const data = await api.getAdminRegistrations(authToken, {
          search,
          payment_status: paymentStatus,
          race_category: raceCategory,
          page,
          page_size: pageSize,
        });
        setResult(data);
      } catch (err) {
        const message =
          err instanceof ApiError || err instanceof Error
            ? err.message
            : "Unable to load registrations.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadRegistrations();
  }, [token, search, paymentStatus, raceCategory, page]);

  if (isChecking) return <div className="loading-block">Checking admin session...</div>;

  const total = result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell title="Registrations" onLogout={logout}>
      <Card className="filter-card">
        <div className="filter-grid">
          <label className="field" htmlFor="registration-search">
            <span className="field-label">Search</span>
            <input
              id="registration-search"
              className="field-input"
              placeholder="Name, cellphone, email, bib number"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
          </label>
          <label className="field" htmlFor="status-filter">
            <span className="field-label">Status</span>
            <select
              id="status-filter"
              className="field-input"
              value={paymentStatus}
              onChange={(event) => {
                setPage(1);
                setPaymentStatus(event.target.value);
              }}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="field" htmlFor="category-filter">
            <span className="field-label">Category</span>
            <select
              id="category-filter"
              className="field-input"
              value={raceCategory}
              onChange={(event) => {
                setPage(1);
                setRaceCategory(event.target.value);
              }}
            >
              <option value="">All categories</option>
              <option value="3K">3K</option>
              <option value="5K">5K</option>
              <option value="10K">10K</option>
            </select>
          </label>
          <Button
            variant="secondary"
            icon={<SearchIcon />}
            onClick={() => setPage(1)}
          >
            Apply
          </Button>
        </div>
      </Card>

      {error ? (
        <Message tone="error" title="Registrations unavailable">
          {error}
        </Message>
      ) : null}

      {isLoading ? <div className="loading-block">Loading registrations...</div> : null}

      {!isLoading && result?.items.length === 0 ? (
        <EmptyState title="No registrations found">
          Try a different search term, payment status, or race category.
        </EmptyState>
      ) : null}

      {result && result.items.length > 0 ? (
        <Card className="table-card">
          <div className="table-meta">
            <span>{total} registrations</span>
            <span>
              Page {page} of {pageCount}
            </span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Bib</th>
                  <th>Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {result.items.map((registration) => {
                  const id = registrationIdOf(registration);

                  return (
                  <tr key={id}>
                    <td>
                      <strong>{fullName(registration)}</strong>
                      <small>{registration.registration_id ?? registration.payment_reference}</small>
                    </td>
                    <td>
                      <span>{registration.cellphone_number}</span>
                      <small>{registration.email}</small>
                    </td>
                    <td>{registration.race_category}</td>
                    <td>
                      <Badge status={paymentStatusOf(registration)} />
                    </td>
                    <td>{registration.bib_number ?? "None"}</td>
                    <td>{formatDate(registration.created_at)}</td>
                    <td>
                      <Link
                        className="text-link"
                        href={`/admin/registrations/${id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Next
            </Button>
          </div>
        </Card>
      ) : null}
    </AdminShell>
  );
}
