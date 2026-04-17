import Link from "next/link";
import { EVENT_NAME } from "@/lib/config";
import { ArrowRightIcon } from "@/components/ui/Icons";

function RunnerMascot({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "runner-mascot compact" : "runner-mascot"}>
      <span className="runner-head" />
      <span className="runner-body" />
      <span className="runner-arm arm-back" />
      <span className="runner-arm arm-front" />
      <span className="runner-leg leg-back" />
      <span className="runner-leg leg-front" />
      <span className="runner-shoe shoe-back" />
      <span className="runner-shoe shoe-front" />
    </span>
  );
}

export function HomeHero() {
  return (
    <main className="home-hero">
      <div className="home-hero-overlay" />
      <div className="home-hero-content">
        <p className="hero-kicker">3K / 5K / 10K Run</p>
        <h1>{EVENT_NAME}</h1>
        <p className="hero-copy">
          Register for the community fun run and keep your reference ready for
          payment confirmation and bib assignment.
        </p>
        <div className="hero-actions">
          <Link className="register-cta" href="/register">
            <span className="runner-track" aria-hidden="true">
              <RunnerMascot compact />
            </span>
            <span>Register Now</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
      <div className="hero-runner" aria-hidden="true">
        <RunnerMascot />
      </div>
    </main>
  );
}
