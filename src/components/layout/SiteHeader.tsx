import Link from "next/link";
import { EVENT_NAME } from "@/lib/config";
import { RunnerIcon } from "@/components/ui/Icons";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <RunnerIcon />
        </span>
        <span>
          <strong>{EVENT_NAME}</strong>
          <small>Registration System</small>
        </span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Register</Link>
        <Link href="/admin/login">Admin</Link>
      </nav>
    </header>
  );
}
