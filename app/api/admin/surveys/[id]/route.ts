import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Survey from "@/models/Survey";

function isAdminEmail(email?: string | null) {
  return !!email && !!process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;
  const survey = await Survey.findById(id).lean();
  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json({ survey });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const nextStatus = body.status;
  const nextActive = body.isActive;

  if (nextStatus !== undefined && nextStatus !== "draft" && nextStatus !== "published") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (nextActive !== undefined && typeof nextActive !== "boolean") {
    return NextResponse.json({ error: "Invalid isActive flag" }, { status: 400 });
  }

  await connectToDatabase();
  const { id } = await params;

  if (nextActive === true) {
    await Survey.updateMany({ isActive: true }, { isActive: false });
  }

  const update: Record<string, unknown> = {};
  if (nextStatus !== undefined) {
    update.status = nextStatus;
  }
  if (nextActive !== undefined) {
    update.isActive = nextActive;
  }

  const survey = await Survey.findByIdAndUpdate(id, update, { new: true }).lean();

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json({ survey });
}
