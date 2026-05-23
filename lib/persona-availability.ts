import {
  PERSONA_RESPONSE_CAP_PER_GROUP,
  SURVEY_PERSONAS,
  UNRESTRICTED_GROUP_MEMBER_LIMIT,
  type SurveyPersonaKey,
} from "@/lib/constants";

type PersonaResponse = {
  persona?: string;
};

export function getPersonaAvailability(responses: PersonaResponse[], groupMemberCount: number) {
  const counts = Object.fromEntries(SURVEY_PERSONAS.map((persona) => [persona.key, 0])) as Record<
    SurveyPersonaKey,
    number
  >;

  for (const response of responses) {
    if (response.persona && response.persona in counts) {
      counts[response.persona as SurveyPersonaKey] += 1;
    }
  }

  const isUnrestrictedGroup = groupMemberCount <= UNRESTRICTED_GROUP_MEMBER_LIMIT;
  const available = isUnrestrictedGroup
    ? SURVEY_PERSONAS
    : SURVEY_PERSONAS.filter((persona) => counts[persona.key] < PERSONA_RESPONSE_CAP_PER_GROUP);

  return { counts, available, isUnrestrictedGroup };
}
