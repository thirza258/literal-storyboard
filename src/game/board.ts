export interface Board {
  name: string;
  /** 1-based stop number along the route. */
  assign: number;
  /** Horizontal position as a fraction of the map's width (0–1). */
  x: number;
  /** Vertical position as a fraction of the map's height (0–1). */
  y: number;
}

const CITY_NAMES: readonly string[] = [
  "Emberfall", "Silverhaven", "Stonebridge", "Whisperwind", "Ironhold",
  "Sunstone", "Moonwhisper", "Riverbend", "Oakhaven", "Shadowfen",
  "Frostpeak", "Gildedreach", "Stormwatch", "Veridian", "Crimsonhold",
  "Azureport", "Mistywood", "Coralcoast", "Obsidian", "Dragon's Tooth",
  "Ebonreach", "Starfall", "Sunkenkeep", "Wyvern's Rest", "Silent Hollow",
  "Thornwood", "Jade Citadel", "Ambergate", "Garnet Hold", "Quartz Ridge",
  "Beryl Shores", "Citrine Bay", "Diamond Vale", "Ruby Glen", "Sapphire Spire",
  "Emerald Crest", "Tanzanite Towers", "Peridot Path", "Aquamarine Altar",
  "Lapis Lagoon", "Amethyst Ascent", "Topaz Terrace", "Opal Oasis",
  "Spinel Summit", "Tourmaline Trail", "Agate Arch", "Malachite Meadow",
  "Serpentine Steps", "Jasper Junction", "Flint Fields", "Granite Glade",
  "Slate Slopes", "Marble Mound", "Chalk Cliffs", "Basalt Bastion",
  "Pumice Peak", "Sandstone Sanctuary", "Clay Commons", "Quicksilver Quarry",
  "Adamant Anvil", "Mithril Mines", "Aurum Alleys", "Electrum Emporium",
  "Bronze Bridge", "Copper Cove",
];

const PAD_X = 0.09;
const PAD_Y = 0.12;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Lays the cities out as a serpentine route across the map instead of scattering
 * them at random, so consecutive stops are always adjacent and the player can
 * read where the token is heading.
 *
 * Positions are fractions of the map, not pixels — the layout survives a resize
 * without being recomputed.
 */
export function buildRoute(size: number): Board[] {
  const count = Math.min(Math.max(size, 2), CITY_NAMES.length);
  const names = shuffle(CITY_NAMES).slice(0, count);

  const cols = Math.max(2, Math.ceil(Math.sqrt(count * 1.8)));
  const rows = Math.max(1, Math.ceil(count / cols));

  const spanX = 1 - PAD_X * 2;
  const spanY = 1 - PAD_Y * 2;
  const xStep = spanX / (cols - 1);
  // Rows are spaced like columns rather than stretched to fill the height, so
  // the hop from the end of one row to the start of the next stays a short walk.
  const yStep = rows === 1 ? 0 : Math.min(spanY / (rows - 1), xStep);
  const yStart = 0.5 - (yStep * (rows - 1)) / 2;

  return names.map((name, i) => {
    const row = Math.floor(i / cols);
    const offsetInRow = i % cols;
    // Reverse every other row so the path snakes rather than jumping back.
    const col = row % 2 === 0 ? offsetInRow : cols - 1 - offsetInRow;

    const x = PAD_X + col * xStep;
    const y = yStart + row * yStep;

    // A little jitter keeps the route from looking like graph paper.
    const jitter = 0.012;
    return {
      name,
      assign: i + 1,
      x: x + (Math.random() - 0.5) * jitter,
      y: y + (Math.random() - 0.5) * jitter,
    };
  });
}
