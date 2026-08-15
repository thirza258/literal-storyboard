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
