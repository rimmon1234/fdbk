import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { getActiveSurvey } from "@/lib/survey";
import SubmissionRecord from "@/models/SubmissionRecord";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const survey = await getActiveSurvey();

  if (!survey) {
    return NextResponse.json({ hasSubmitted: false, survey: null });
  }

  const record = await SubmissionRecord.findOne({
    userId: session.user.userId,
    surveyId: survey._id,
  }).lean();

  return NextResponse.json({
    hasSubmitted: Boolean(record),
    surveyId: survey._id,
    survey,
  });
}
