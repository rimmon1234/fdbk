"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/builder", label: "Survey Builder" },
  { href: "/dashboard", label: "Analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/80">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">FDBK Admin</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--foreground)] ${
                  pathname === link.href ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]" />
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] md:hidden"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {open && (
        <div className="border-b border-[var(--border)] bg-[var(--background)] md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
