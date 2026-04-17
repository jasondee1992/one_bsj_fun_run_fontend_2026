"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { EVENT_NAME } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { ListIcon, ShieldIcon } from "@/components/ui/Icons";

export function AdminShell({
  children,
  title,
  eyebrow = "Admin",
  actions,
  onLogout,
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  onLogout: () => void;
}) {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/admin/dashboard">
          <span className="brand-mark">
            <ShieldIcon />
          </span>
          <span>
            <strong>{EVENT_NAME}</strong>
            <small>Admin Console</small>
          </span>
        </Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/registrations">
            <ListIcon />
            Registrations
          </Link>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Sign out
          </Button>
        </nav>
      </header>

      <div className="admin-content">
        <div className="page-title-row">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          {actions}
        </div>
        {children}
      </div>
    </main>
  );
}
