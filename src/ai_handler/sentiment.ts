import { chatJson, hasApiKey, REALM_LORE } from "./client";
import { TEXT_MODEL } from "./models";

export interface SentimentVerdict {
  /** true = the reply won an ally, false = it made an enemy. */
  sentiment: boolean;
  /** One line the game shows back to the player explaining the swing. */
  reason: string;
}

const systemInstruction = `You grade a player's reply to an inhabitant of the world below.

${REALM_LORE}

Return sentiment true when the reply is supportive, hopeful, loyal or kind — the speaker gains an ally.
Return sentiment false when it is hostile, dismissive, cynical or cruel — the speaker gains an enemy.
"reason" is one short in-world sentence (under 140 characters) describing how the listener reacted.`;

const responseSchema = {
  type: "object",
  properties: {
    sentiment: { type: "boolean" },
    reason: { type: "string" },
  },
  required: ["sentiment", "reason"],
  additionalProperties: false,
};

const isVerdict = (data: unknown): data is SentimentVerdict =>
  typeof data === "object" &&
  data !== null &&
  typeof (data as Record<string, unknown>).sentiment === "boolean";

/**
 * Cheap offline stand-in for the grader, used when there is no API key or the
 * call fails, so an answer always resolves to an ally or an enemy.
 */
function fallbackVerdict(input: string): SentimentVerdict {
  const negative =
    /\b(hate|never|cheap|lie|lies|liar|fool|coward|curse|die|kill|worthless|nonsense|shadow|doom)\b/i;
  const sentiment = !negative.test(input);
  return {
    sentiment,
    reason: sentiment
      ? "Your words are taken kindly — the listener nods and stands a little closer."
      : "Your words land badly — the listener stiffens and turns away.",
  };
}

/** Grades a player's answer. Never throws. */
export async function gradeAnswer({
  input,
  signal,
}: {
  input: string;
  signal?: AbortSignal;
}): Promise<SentimentVerdict> {
  if (!hasApiKey) return fallbackVerdict(input);

  try {
    const parsed = await chatJson({
      model: TEXT_MODEL,
      system: systemInstruction,
      user: input,
      schemaName: "sentiment_verdict",
      schema: responseSchema,
      temperature: 0.4,
      maxTokens: 1024,
      signal,
    });

    if (!isVerdict(parsed)) throw new Error("Invalid sentiment data structure");

    return {
      sentiment: parsed.sentiment,
      // The model may omit the flavour line; keep the offline one as a floor.
      reason: parsed.reason?.trim() || fallbackVerdict(input).reason,
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    console.error("Sentiment grading failed, using offline grader:", error);
    return fallbackVerdict(input);
  }
}
