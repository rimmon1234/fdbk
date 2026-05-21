import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default";
}

export default function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--card-foreground)] shadow-sm ${className}`}
    />
  );
}
