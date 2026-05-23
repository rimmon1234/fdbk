export const AUTHORIZED_TESTER_COUNT = 39;

export const SURVEY_PERSONAS = [
  { key: "student", label: "Student" },
  { key: "teacher", label: "Professor" },
  { key: "admin_hod", label: "Admin / HOD" },
] as const;

export type SurveyPersonaKey = (typeof SURVEY_PERSONAS)[number]["key"];

export const PERSONA_RESPONSE_CAP_PER_GROUP = 2;
export const UNRESTRICTED_GROUP_MEMBER_LIMIT = 2;

const DEFAULT_SURVEY_GROUPS = [
  "Group 1",
  "Group 2",
  "Group 3",
  "Group 4",
  "Group 5",
  "Group 6",
  "Group 7",
  "Group 8",
  "Group 9",
  "Group 10",
  "Group test",
];

export function getSurveyGroups() {
  const configuredGroups = process.env.SURVEY_GROUPS ?? process.env.NEXT_PUBLIC_SURVEY_GROUPS;
  if (!configuredGroups) return DEFAULT_SURVEY_GROUPS;

  const groups = configuredGroups
    .split(",")
    .map((group) => group.trim())
    .filter(Boolean);

  return groups.length > 0 ? groups : DEFAULT_SURVEY_GROUPS;
}
