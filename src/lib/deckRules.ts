import { Card, CharacterCard, MissionCard } from "@/data/cards";

export const DECK_RULES = {
  MAX_CHARACTER_CARDS: 30,
  MAX_MISSION_CARDS: 3,
  MAX_COPIES_PER_NAME: 3,
} as const;

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  characterCount: number;
  missionCount: number;
}

export function validateDeck(characters: CharacterCard[], missions: MissionCard[]): DeckValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (characters.length !== DECK_RULES.MAX_CHARACTER_CARDS) {
    errors.push(`Character deck must have exactly ${DECK_RULES.MAX_CHARACTER_CARDS} cards (currently ${characters.length})`);
  }

  if (missions.length !== DECK_RULES.MAX_MISSION_CARDS) {
    errors.push(`Mission deck must have exactly ${DECK_RULES.MAX_MISSION_CARDS} cards (currently ${missions.length})`);
  }

  // Check copies per name for characters
  const charNameCounts: Record<string, number> = {};
  characters.forEach((c) => {
    charNameCounts[c.name] = (charNameCounts[c.name] || 0) + 1;
  });
  for (const [name, count] of Object.entries(charNameCounts)) {
    if (count > DECK_RULES.MAX_COPIES_PER_NAME) {
      errors.push(`Max ${DECK_RULES.MAX_COPIES_PER_NAME} copies of "${name}" allowed (have ${count})`);
    }
  }

  // Check mission duplicates (each mission unique)
  const missionTitles = missions.map((m) => m.title);
  const uniqueMissions = new Set(missionTitles);
  if (uniqueMissions.size !== missionTitles.length) {
    errors.push("Each mission card must be unique");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    characterCount: characters.length,
    missionCount: missions.length,
  };
}

export function canAddCard(
  card: Card,
  currentCharacters: CharacterCard[],
  currentMissions: MissionCard[]
): { allowed: boolean; reason?: string } {
  if (card.type === "character") {
    if (currentCharacters.length >= DECK_RULES.MAX_CHARACTER_CARDS) {
      return { allowed: false, reason: `Character deck is full (${DECK_RULES.MAX_CHARACTER_CARDS}/${DECK_RULES.MAX_CHARACTER_CARDS})` };
    }
    const sameNameCount = currentCharacters.filter((c) => c.name === card.name).length;
    if (sameNameCount >= DECK_RULES.MAX_COPIES_PER_NAME) {
      return { allowed: false, reason: `Already have ${DECK_RULES.MAX_COPIES_PER_NAME} copies of "${card.name}"` };
    }
    return { allowed: true };
  } else {
    if (currentMissions.length >= DECK_RULES.MAX_MISSION_CARDS) {
      return { allowed: false, reason: `Mission deck is full (${DECK_RULES.MAX_MISSION_CARDS}/${DECK_RULES.MAX_MISSION_CARDS})` };
    }
    const alreadyHas = currentMissions.some((m) => m.title === (card as MissionCard).title);
    if (alreadyHas) {
      return { allowed: false, reason: `"${(card as MissionCard).title}" is already in your missions` };
    }
    return { allowed: true };
  }
}
