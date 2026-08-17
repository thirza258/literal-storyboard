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

  // Keyboard controls
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
      <div className="flex flex-col items-center justify-center h-[75vh] text-white space-y-4">
        <div className="text-xl font-cinzel text-amber-300">Riding into {city}…</div>
        <div className="w-64 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
          <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 to-yellow-400 animate-pulse rounded-full" />
        </div>
        <p className="text-xs text-slate-400">AI Storyteller Agent is weaving the encounter…</p>
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] rounded-2xl overflow-hidden gilded-border-glow shadow-2xl ls-fade-in">
      {/* Bundled Scene Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bundledArt})` }}
      />
      {/* Generated AI Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: generatedArt ? `url(${generatedArt})` : undefined,
          opacity: generatedArt ? 1 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* City & NPC Tag Header */}
      <div className="absolute top-4 left-5 flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300">
        <span className="bg-black/70 px-3 py-1 rounded-lg border border-amber-500/30 font-bold font-cinzel">
          📍 {city} · {npc}
        </span>
        {generatedArt && (
          <span className="rounded bg-black/70 px-2.5 py-1 text-[11px] normal-case text-emerald-300 border border-emerald-500/30 ls-fade-in">
            ✨ Scene painted by AI Agent
          </span>
        )}
      </div>

      {/* Story Text Box & Dialogue */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white bg-slate-950/80 backdrop-blur-md border-t border-amber-500/30">
        {phase === "story" && (
          <div onClick={advance} className="w-full cursor-pointer select-none space-y-2">
            <p className="min-h-[4rem] text-base sm:text-lg leading-relaxed drop-shadow font-medium text-slate-100">
              {currentLine.slice(0, visibleChars)}
              {!isLineComplete && <span className="text-amber-400 animate-pulse">▌</span>}
            </p>
            <span className="inline-block text-xs font-semibold text-amber-400 font-cinzel">
              {isLineComplete
                ? lineIndex < (story?.story.length ?? 0) - 1
                  ? "Click or press Space to continue ▸"
                  : "Click or press Space to hear their dilemma ▸"
                : "Click to reveal line"}
            </span>
          </div>
        )}

        {phase === "question" && story && (
          <div className="ls-pop-in space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
                🗣️ {npc} asks:
              </span>
              <p className="text-base sm:text-lg font-bold text-white drop-shadow font-cinzel">
                "{story.question}"
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {story.listOfAnswer.map((answer, i) => (
                <button
                  key={`${i}-${answer}`}
                  className="text-left px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 hover:border-yellow-400 hover:text-amber-200 border border-slate-700 transition-all duration-200 text-sm font-medium flex items-start gap-3 shadow-md"
                  onClick={() => handleAnswerClick(answer)}
                >
                  <span className="text-xs mt-0.5 px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30 font-mono">
                    {i + 1}
                  </span>
                  <span className="flex-1">{answer}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "grading" && (
          <div className="flex items-center gap-3 py-4">
            <span className="h-5 w-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <p className="text-amber-300 font-cinzel font-semibold text-sm">
              The {npc.toLowerCase()} weighs the tone and morality of your words…
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Novel;
