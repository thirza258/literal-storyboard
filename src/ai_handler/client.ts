const BASE_URL = "https://openrouter.ai/api/v1";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

/**
 * Whether the app can reach OpenRouter at all. Callers use this to fall back to
 * bundled content instead of showing an error screen — the game stays playable
 * without a key.
 */
export const hasApiKey = Boolean(apiKey?.trim());

/** Optional headers that let the app show up on the OpenRouter leaderboards. */
function appHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return {
    "HTTP-Referer": window.location.origin,
    "X-Title": "Literal Storyboard",
  };
}

/**
 * POSTs to OpenRouter and returns the parsed body.
 *
 * `fetch` resolves happily on 4xx/5xx, so the status is checked here — without
 * it a bad key or an unknown model slug would come back as an `{ error }` body,
 * fail schema validation upstream, and look exactly like a model quirk.
 */
async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  if (!hasApiKey) {
    throw new Error(
      "VITE_OPENROUTER_API_KEY is not set — add it to .env to enable AI content."
    );
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...appHeaders(),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenRouter ${response.status}: ${detail.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

interface ChatCompletion {
  choices?: Array<{
    message?: { content?: string | Record<string, unknown> | null };
    finish_reason?: string;
  }>;
}

/** Strips the ```json fences some providers wrap structured output in. */
function stripFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

export interface ChatJsonRequest {
  model: string;
  system: string;
  user: string;
  /** Slug identifying the schema, required by the structured-output API. */
  schemaName: string;
  /** Plain JSON Schema. Keep it flat and mark every property required. */
  schema: Record<string, unknown>;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * One chat completion constrained to a JSON schema. Returns the decoded body as
 * `unknown` — callers validate it, because `strict` enforcement varies by
 * provider and OpenRouter lets you point any model at this.
 */
export async function chatJson({
  model,
  system,
  user,
  schemaName,
  schema,
  temperature,
  maxTokens,
  signal,
}: ChatJsonRequest): Promise<unknown> {
  const completion = await post<ChatCompletion>(
    "/chat/completions",
    {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: {
        type: "json_schema",
        json_schema: { name: schemaName, strict: true, schema },
      },
    },
    signal
  );

  const choice = completion.choices?.[0];
  if (choice?.finish_reason === "length") {
    // Otherwise this surfaces as an opaque JSON.parse error on truncated output.
    throw new Error(`Response hit the token limit before the JSON closed`);
  }

  const content = choice?.message?.content;
  if (content == null) throw new Error("Empty response from the model");

  // Providers return the JSON as a string; a few hand back an object already.
  return typeof content === "string" ? JSON.parse(stripFences(content)) : content;
}

interface ImageResponse {
  data?: Array<{ b64_json?: string; media_type?: string; url?: string }>;
}

export interface ImageRequest {
  model: string;
  prompt: string;
  /** Must be one of the values the chosen model advertises. */
  aspectRatio?: string;
  resolution?: string;
  signal?: AbortSignal;
}

/**
 * One image from OpenRouter's image endpoint, as a data URL (or a hosted URL if
 * the provider returns one instead of bytes). Returns null when the response
 * carries no image.
 */
export async function generateImage({
  model,
  prompt,
  aspectRatio,
  resolution,
  signal,
}: ImageRequest): Promise<string | null> {
  const result = await post<ImageResponse>(
    "/images",
    {
      model,
      prompt,
      n: 1,
      aspect_ratio: aspectRatio,
      resolution,
    },
    signal
  );

  const image = result.data?.[0];
  if (!image) return null;
  if (image.b64_json) {
    return `data:${image.media_type ?? "image/png"};base64,${image.b64_json}`;
  }
  return image.url ?? null;
}

/** The lore every prompt is grounded in. */
export const REALM_LORE = `The Emerald Realm: The Quest for the Lost Crown

In the kingdom of Eldoria, peace was held together by the Emerald Crown, an artifact said to be forged by the gods. One dark night the crown was stolen by the sorcerer Malakar, who sought to plunge Eldoria into darkness.

King Alden called four heroes to retrieve it:
- Sir Roderick, a noble knight of unmatched swordsmanship.
- Elysia, an elven archer whose arrows never miss.
- Thrain, a dwarf warrior with a mighty axe and an indomitable spirit.
- Soraya, a human mage versed in ancient spells.

They crossed forests, mountains and wastelands to reach Shadowmoor, a land twisted by Malakar's magic, and stormed the Sorcerer's Fortress. Soraya's spell of Purification loosened Malakar's grip on the crown, and Sir Roderick struck the decisive blow. The crown was restored to Eldoria's Royal Hall, and the realm thrived once more.`;
