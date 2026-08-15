import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageHarbour from "../assets/image_harbour.png";
import imageHome from "../assets/image_home.png";
import imageCityStreet from "../assets/image_city_street.png";
import imageHall from "../assets/image_hall.png";
import imageDining from "../assets/image_dining.png";
import { generateStory, type StoryData } from "../ai_handler/ai";
import { generateSceneImage } from "../ai_handler/image";

interface NovelProps {
  city: string;
  /** Chosen when the party arrives, so it stays stable across re-renders. */
  npc: string;
  onAnswer: (answer: string) => Promise<void>;
}

/** Bundled art, used until (or instead of) a generated scene. */
const FALLBACK_ART = [
  imageHarbour,
  imageHome,
  imageCityStreet,
  imageHall,
  imageDining,
];

const TYPE_MS = 18;

/** Stable per-city choice, so revisiting a place looks like the same place. */
function fallbackArtFor(city: string) {
  let hash = 0;
  for (let i = 0; i < city.length; i++) hash = (hash * 31 + city.charCodeAt(i)) | 0;
  return FALLBACK_ART[Math.abs(hash) % FALLBACK_ART.length];
}

const Novel: React.FC<NovelProps> = ({ city, npc, onAnswer }) => {
  const bundledArt = useMemo(() => fallbackArtFor(city), [city]);

  const [story, setStory] = useState<StoryData | null>(null);
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "story" | "question" | "grading">(
    "loading"
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Story first — the scene is readable the moment it arrives, and the
  // generated background fades in behind it whenever it is ready.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const data = await generateStory({ npc, city, signal: controller.signal });
      if (controller.signal.aborted) return;

      setStory(data);
      setLineIndex(0);
      setVisibleChars(0);
      setPhase("story");

      const url = await generateSceneImage(data.scene, controller.signal);
      if (!url || controller.signal.aborted) return;

      // Decode before swapping so the background never flashes half-painted.
      const img = new Image();
      img.onload = () => {
        if (!controller.signal.aborted && mounted.current) setGeneratedArt(url);
      };
      img.src = url;
    })().catch(() => {
      /* generateStory and generateSceneImage already fall back on their own. */
    });

    return () => controller.abort();
  }, [npc, city]);

  const currentLine = story?.story[lineIndex] ?? "";
  const isLineComplete = visibleChars >= currentLine.length;

  // Typewriter reveal.
  useEffect(() => {
    if (phase !== "story" || isLineComplete) return;
    const id = window.setInterval(() => {
      setVisibleChars((prev) => Math.min(prev + 1, currentLine.length));
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [phase, isLineComplete, currentLine.length]);

  /** One click/keypress finishes the line; the next one moves on. */
  const advance = useCallback(() => {
    if (phase !== "story" || !story) return;

    if (!isLineComplete) {
      setVisibleChars(currentLine.length);
      return;
    }

    if (lineIndex < story.story.length - 1) {
      setLineIndex((prev) => prev + 1);
      setVisibleChars(0);
    } else {
      setPhase("question");
    }
  }, [phase, story, isLineComplete, currentLine.length, lineIndex]);

  // Keyboard only, and only while prose is on screen — the old build listened
  // for clicks on `window` as well, which fired alongside the button's own
  // handler and skipped two lines at a time. Scoping to the story phase also
  // keeps Enter free for keyboard users choosing an answer.
  useEffect(() => {
    if (phase !== "story") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (["Enter", " ", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, advance]);

  const handleAnswerClick = async (answer: string) => {
    setPhase("grading");
    await onAnswer(answer);
  };

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-white">
        <div className="mb-4 text-lg">Riding into {city}…</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-yellow-400 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] rounded-lg overflow-hidden border-2 border-yellow-700/60 ls-fade-in">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bundledArt})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: generatedArt ? `url(${generatedArt})` : undefined,
          opacity: generatedArt ? 1 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute top-3 left-4 flex items-center gap-2 text-xs uppercase tracking-widest text-yellow-300/90">
        <span>
          {city} · {npc}
        </span>
        {generatedArt && (
          <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] normal-case text-yellow-200 ls-fade-in">
            scene painted for this moment
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {/*
          Deliberately not a <button>: a focused button would be activated by the
          same Space/Enter press the window listener handles, advancing twice.
          Keyboard access comes from that listener, which is always active.
        */}
        {phase === "story" && (
          <div onClick={advance} className="w-full cursor-pointer select-none">
            <p className="min-h-[4.5rem] text-lg leading-relaxed drop-shadow">
              {currentLine.slice(0, visibleChars)}
              {!isLineComplete && <span className="animate-pulse">▌</span>}
            </p>
            <span className="mt-2 inline-block text-sm text-yellow-300">
              {isLineComplete
                ? lineIndex < (story?.story.length ?? 0) - 1
                  ? "Click or press Space to continue ▸"
                  : "Click or press Space to hear their question ▸"
                : "Click to reveal the whole line"}
            </span>
          </div>
        )}

        {phase === "question" && story && (
          <div className="ls-pop-in">
            <p className="text-lg font-semibold mb-3 drop-shadow">{story.question}</p>
            <div className="flex flex-col gap-2">
              {story.listOfAnswer.map((answer, i) => (
                <button
                  key={`${i}-${answer}`}
                  className="text-left px-4 py-2 rounded bg-black/60 hover:bg-yellow-500/80 hover:text-black border border-white/20 transition-colors"
                  onClick={() => handleAnswerClick(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "grading" && (
          <div className="flex items-center gap-3 py-6">
            <span className="h-4 w-4 rounded-full border-2 border-yellow-300 border-t-transparent animate-spin" />
            <p className="text-yellow-200">
              The {npc.toLowerCase()} weighs your words…
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Novel;
