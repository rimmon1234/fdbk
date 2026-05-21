import { HTMLAttributes } from "react";

export default function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={`rounded-full bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium text-[var(--secondary-foreground)] ${className}`}
    />
  );
}
