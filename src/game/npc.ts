export const NPCS = [
  "Villager",
  "Knight",
  "King",
  "Queen",
  "Merchant",
  "Maid",
  "Servant",
  "Bandit",
] as const;

export type Npc = (typeof NPCS)[number];

/** Picked when the party arrives, never during render. */
export function randomNpc(): Npc {
  return NPCS[Math.floor(Math.random() * NPCS.length)];
}
