import Link from "next/link";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function LinkButton({
  href,
  children,
  icon,
  variant = "secondary",
}: LinkButtonProps) {
  return (
    <Link className={`button button-${variant} button-md`} href={href}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
