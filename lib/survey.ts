import Survey from "@/models/Survey";

export async function getActiveSurvey() {
  const now = new Date();
  return Survey.findOne({ status: "published", isActive: true }).lean().then((survey) => {
    if (!survey) return null;
    if (survey.expiresAt) {
      const expiresAt = new Date(survey.expiresAt);
      const expiresAtEndOfDay = new Date(expiresAt);
      expiresAtEndOfDay.setHours(23, 59, 59, 999);
      if (expiresAtEndOfDay < now) {
        return { ...survey, isExpired: true };
      }
    }
    return { ...survey, isExpired: false };
  });
}
