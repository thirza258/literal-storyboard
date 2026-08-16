import { generateImage, hasApiKey } from "./client";
import {
  IMAGE_ASPECT_RATIO,
  IMAGE_MODEL,
  IMAGE_RESOLUTION,
} from "./models";

const STYLE =
  "Digital painting, high-fantasy medieval concept art, cinematic lighting, painterly brushwork, wide establishing shot, no people, no text or lettering.";

/** Prompt -> image URL, so revisiting a scene never pays for a second generation. */
const cache = new Map<string, Promise<string | null>>();

/**
 * Generates a background for a story beat through OpenRouter's image endpoint
 * and returns it as a data URL.
 *
 * Returns `null` rather than throwing whenever generation is unavailable (no
 * API key, network error, safety filter). Callers are expected to fall back to
 * a bundled background — a missing image must never block the scene.
 */
export function generateSceneImage(
  scene: string,
  signal?: AbortSignal
): Promise<string | null> {
  if (!hasApiKey || !scene.trim()) return Promise.resolve(null);

  const key = scene.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const pending = generateImage({
    model: IMAGE_MODEL,
    prompt: `${scene.trim()} ${STYLE}`,
    aspectRatio: IMAGE_ASPECT_RATIO,
    resolution: IMAGE_RESOLUTION,
    signal,
  }).catch((error) => {
    // Drop the failure so a later beat with the same scene can retry.
    cache.delete(key);
    if (!signal?.aborted) {
      console.error("Scene image generation failed, using bundled art:", error);
    }
    return null;
  });

  cache.set(key, pending);
  return pending;
}
