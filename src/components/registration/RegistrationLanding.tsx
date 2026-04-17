import { RegistrationForm } from "@/components/registration/RegistrationForm";

export function RegistrationLanding() {
  return (
    <main className="page-shell">
      <div className="registration-layout">
        <aside className="event-panel">
          <p className="eyebrow">Local MVP</p>
          <h2>Run day registration, payment tracking, and bib confirmation.</h2>
          <div className="event-stats" aria-label="Race categories">
            <span>3K</span>
            <span>5K</span>
            <span>10K</span>
          </div>
          <p>
            After submitting, keep your registration reference. Payment remains
            pending until the backend records a successful payment.
          </p>
        </aside>
        <RegistrationForm />
      </div>
    </main>
  );
}
