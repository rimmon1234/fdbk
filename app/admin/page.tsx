"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin/builder", label: "Survey Builder", active: true },
  { href: "/admin", label: "Published Surveys", active: false },
  { href: "/dashboard", label: "Analytics", active: false },
];

export default function AdminPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] md:grid md:grid-cols-[250px_1fr]">
      <button
        type="button"
        className="m-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius)] border border-[var(--sidebar-border)] bg-[var(--sidebar)] md:hidden"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu />
      </button>
      <aside
        className={`${open ? "block" : "hidden"} border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] p-4 md:block`}
      >
        <nav className="space-y-2">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block min-h-11 rounded-[var(--radius)] px-3 py-2 text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] ${item.active ? "border-l-2 border-[var(--primary)]" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Use the Survey Builder to create and publish your next anonymous lab-course instrument.
        </p>
      </main>
    </div>
  );
}
