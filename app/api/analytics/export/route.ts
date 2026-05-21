import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const formatParam = url.searchParams.get("format") ?? "csv";

  const analyticsResponse = await fetch(`${url.origin}/api/analytics`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (!analyticsResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }

  const analyticsData = await analyticsResponse.json();

  if (formatParam === "summary") {
    return NextResponse.json({
      summary: analyticsData.aggregates.map((item: { prompt: string; responseCount: number }) => ({
        prompt: item.prompt,
        responseCount: item.responseCount,
      })),
    });
  }

  const rows = ["question prompt,option label,count,percentage"];

  for (const item of analyticsData.aggregates as Array<{ prompt: string; responseCount: number; data: Record<string, number> }>) {
    const total = Math.max(item.responseCount, 1);
    for (const [label, count] of Object.entries(item.data)) {
      const percentage = ((count / total) * 100).toFixed(2);
      rows.push(`"${item.prompt.replace(/"/g, '""')}","${label.replace(/"/g, '""')}",${count},${percentage}`);
    }
  }

  const csv = `${rows.join("\n")}\n`;
  const filename = `survey-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}
