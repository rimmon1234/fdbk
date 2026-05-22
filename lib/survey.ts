import Survey from "@/models/Survey";

export async function getActiveSurvey() {
  const now = new Date();
  return Survey.findOne({ status: "published", isActive: true }).lean().then((survey) => {
    if (!survey) return null;
    if (survey.expiresAt && new Date(survey.expiresAt) < now) {
      return { ...survey, isExpired: true };
    }
    return { ...survey, isExpired: false };
  });
}
