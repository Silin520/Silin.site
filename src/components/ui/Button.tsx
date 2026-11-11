import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Common = { children: ReactNode; variant?: "primary" | "ghost"; arrow?: boolean; className?: string };
type AsLink = Common & { href: string } & { onClick?: never };
type AsButton = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: AsLink | AsButton) {
  const { children, variant = "primary", arrow = true, className = "" } = props;
  const cls = `btn ${variant === "ghost" ? "btn-ghost" : ""} ${className}`;
  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && <ArrowRight size={15} className="arrow relative" />}
    </>
  );
  if (typeof props.href === "string") {
    return (
      <Link href={props.href} className={cls}>
        {inner}
      </Link>
    );
  }
  const { variant: _v, arrow: _a, className: _c, children: _ch, href: _h, ...rest } = props as AsButton;
  void _v; void _a; void _c; void _ch; void _h;
  return (
    <button type="button" {...rest} className={cls}>
      {inner}
    </button>
  );
}
