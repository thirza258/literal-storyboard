/**
 * Every model the app talks to, in one place.
 *
 * Requests go through OpenRouter, so these are OpenRouter slugs — any model on
 * https://openrouter.ai/models can be dropped in here without touching the
 * handlers. The defaults keep the game's previous behaviour; swapping in
 * `openai/gpt-5.4-mini` or `anthropic/claude-haiku-4.5` is a one-line change.
 */

/**
 * Story beats and sentiment grading. Must be a model that advertises
 * `structured_outputs` — check `supported_parameters` on
 * https://openrouter.ai/api/v1/models before switching.
 */
export const TEXT_MODEL = "google/gemini-3.7-flash";

/**
 * Free models available on OpenRouter when credits are exhausted.
 */
export const DEFAULT_FREE_MODELS: string[] = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "nvidia/nemotron-3.5-super-vl:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "cohere/north-mini-code:free",
  "liquid/lfm-2.5-2.6b:free",
  "recursive/flint-v1.0:free",
  "dots-studio/dots-3-note-preview:free",
];

export function getShuffledFreeModels(excludeModel?: string): string[] {
  const models = DEFAULT_FREE_MODELS.filter((m) => m !== excludeModel);
  for (let i = models.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [models[i], models[j]] = [models[j], models[i]];
  }
  return models;
}

/**
 * Scene backgrounds. The cheapest, fastest image model in the Nano Banana
 * family, which matters because a scene is generated on every story beat.
 */
export const IMAGE_MODEL = "google/gemini-3.1-flash-lite-image";

/**
 * `aspect_ratio` and `resolution` are per-model enums on OpenRouter — this
 * model accepts only "1K", and caps `n` at 1. Check
 * https://openrouter.ai/api/v1/images/models after changing IMAGE_MODEL.
 */
export const IMAGE_ASPECT_RATIO = "16:9";
export const IMAGE_RESOLUTION = "1K";
