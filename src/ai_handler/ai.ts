import { chatJson, hasApiKey, REALM_LORE } from "./client";
import { TEXT_MODEL } from "./models";

export interface StoryData {
  /** One line per beat — the novel screen advances through these. */
  story: string[];
  question: string;
  listOfAnswer: string[];
  /** Short visual description of the setting, used as the image prompt. */
  scene: string;
}

export interface StoryRequest {
  /** Which NPC is speaking, e.g. "Merchant". */
  npc: string;
  /** The city the player just landed on, so the beat matches the board. */
  city: string;
  signal?: AbortSignal;
}

const systemInstruction = `You are a narrator for a fantasy medieval game set in the world below. You speak as one of its inhabitants and end every exchange by asking the player something.

${REALM_LORE}

Rules:
- "story" is 2 to 4 short lines of prose in the NPC's voice. Each entry is one line the player clicks through — keep each under 220 characters.
- "question" is a single question the NPC puts to the player.
- "listOfAnswer" holds 3 to 5 distinct replies the player could choose. Mix supportive, neutral and hostile options — the player's tone is graded, so the choices must genuinely differ in sentiment.
- "scene" is a single sentence describing the location visually (lighting, architecture, weather), with no characters or text in frame.`;

// `strict: true` needs every property listed in `required` and
// `additionalProperties: false`, or providers with native strict mode reject it.
const responseSchema = {
  type: "object",
  properties: {
    story: { type: "array", items: { type: "string" } },
    question: { type: "string" },
    listOfAnswer: { type: "array", items: { type: "string" } },
    scene: { type: "string" },
  },
  required: ["story", "question", "listOfAnswer", "scene"],
  additionalProperties: false,
};

const isStoryData = (data: unknown): data is StoryData => {
  if (typeof data !== "object" || data === null) return false;
  const candidate = data as Record<string, unknown>;
  const isStringArray = (value: unknown) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0);

  return (
    isStringArray(candidate.story) &&
    isStringArray(candidate.listOfAnswer) &&
    typeof candidate.question === "string" &&
    typeof candidate.scene === "string"
  );
};

/** Used when there is no API key, or the call fails — the game keeps running. */
export function fallbackStory({ npc, city }: { npc: string; city: string }): StoryData {
  return {
    story: [
      `A ${npc.toLowerCase()} of ${city} steps into your path, eyes narrowed against the wind.`,
      `"Word travels fast, traveller. They say the Emerald Crown has been returned to the Royal Hall — and that Malakar's shadows still linger in the hills."`,
    ],
    question: `What do you make of the tales out of ${city}, traveller?`,
    listOfAnswer: [
      "The heroes saved us all. Eldoria owes them everything.",
      "I keep my own counsel until I see the crown with my own eyes.",
      "Stories are cheap. Malakar's shadows are the only truth left here.",
    ],
    scene: `A weathered medieval street in the town of ${city} at dusk, lantern light on wet stone, distant mountains under a bruised sky.`,
  };
}

/**
 * Asks OpenRouter for the next story beat. Never throws: on any failure it returns
 * bundled content so a dice roll always leads somewhere.
 */
export async function generateStory({
  npc,
  city,
  signal,
}: StoryRequest): Promise<StoryData> {
  if (!hasApiKey) return fallbackStory({ npc, city });

  try {
    const parsed = await chatJson({
      model: TEXT_MODEL,
      system: systemInstruction,
      user: `Assume you are a ${npc} in the town of ${city}. Greet the traveller and put a question to them.`,
      schemaName: "story_beat",
      schema: responseSchema,
      temperature: 1,
      // Headroom: some models spend part of the budget on reasoning tokens,
      // and a truncated response is invalid JSON that silently hits the fallback.
      maxTokens: 4096,
      signal,
    });

    if (!isStoryData(parsed)) throw new Error("Invalid story data structure");

    return parsed;
  } catch (error) {
    if (signal?.aborted) throw error;
    console.error("Story generation failed, using bundled story:", error);
    return fallbackStory({ npc, city });
  }
}
