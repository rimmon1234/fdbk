"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";

import { useEffect, useState } from "react";

type Survey = {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
  isActive?: boolean;
};

export default function AdminPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/surveys")
      .then((res) => res.json())
      .then((data) => setSurveys(data.surveys ?? []));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/survey`);
    }
  }, []);

  const setActiveSurvey = async (surveyId: string) => {
    setIsUpdating(true);
    const response = await fetch(`/api/admin/surveys/${surveyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });

    if (response.ok) {
      const updated = await response.json();
      setSurveys((prev) =>
        prev.map((survey) => ({
          ...survey,
          isActive: survey._id === updated.survey._id,
        }))
      );
    }

    setIsUpdating(false);
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-[var(--muted-foreground)]">
              Create, publish, and monitor surveys without typing URLs.
            </p>
          </div>
          <Link
            href="/survey"
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
          >
            Test Survey
          </Link>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Share survey link</p>
              <p className="text-xs text-[var(--muted-foreground)]">Send this URL to testers.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)]">
                {shareUrl || "Loading..."}
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-50"
                onClick={() => shareUrl && navigator.clipboard.writeText(shareUrl)}
                disabled={!shareUrl}
              >
                Copy Link
              </button>
            </div>
          </div>

          <div className="space-y-4">
          <h2 className="text-xl font-semibold">Published Surveys</h2>
          {surveys.length === 0 ? (
            <p className="text-[var(--muted-foreground)]">No surveys published yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {surveys.map((survey) => (
                <Card key={survey._id} className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{survey.title || "Untitled Survey"}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] capitalize">Status: {survey.status}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Created: {new Date(survey.createdAt).toLocaleDateString()}
                    </p>
                    {survey.isActive ? (
                      <p className="text-xs font-semibold text-[var(--primary)]">Active Survey</p>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-50"
                      onClick={() => setActiveSurvey(survey._id)}
                      disabled={isUpdating || survey.isActive}
                    >
                      {survey.isActive ? "Active" : "Set Active"}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          </div>
        </div>
      </main>
  );
}
