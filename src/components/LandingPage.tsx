import React, { useState } from "react";
import { Link } from "react-router-dom";
import fantasyMap from "../assets/map.svg";
import characterImg from "../assets/character.png";
import imageCityStreet from "../assets/image_city_street.png";
import imageHarbour from "../assets/image_harbour.png";
import imageHall from "../assets/image_hall.png";
import imageDining from "../assets/image_dining.png";
import { hasApiKey } from "../ai_handler/client";
import SEO from "./SEO";

interface LandingPageProps {
  onStartGame: (username: string, boardSize: number, companion?: string) => void;
  winMargin: number;
}

interface HeroCompanion {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  quote: string;
  icon: string;
  color: string;
  trait: string;
}

const HERO_COMPANIONS: HeroCompanion[] = [
  {
    id: "roderick",
    name: "Sir Roderick",
    title: "The Paragon Knight",
    role: "Swordsman of the Vanguard",
    bio: "First knight of Eldoria's royal guard. His unbreakable code of honour and mastery of the blade inspired the realm during the siege of Highspire.",
    quote: "My blade answers only to justice and the true Crown.",
    icon: "🗡️",
    color: "from-amber-500/20 to-yellow-600/10 border-amber-500/40 text-amber-300",
    trait: "+Valour & Chivalry",
  },
  {
    id: "elysia",
    name: "Elysia",
    title: "The Elven Archer",
    role: "Scout of the Whispering Glade",
    bio: "Guardian of the elder forests whose arrows never miss their mark. She can read tracks across ancient stone and senses Malakar's foul sorcery in the wind.",
    quote: "The trees remember the Crown's light. We shall restore it.",
    icon: "🏹",
    color: "from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300",
    trait: "+Wildcraft & Perception",
  },
  {
    id: "thrain",
    name: "Thrain",
    title: "The Iron Dwarf",
    role: "Berserker & Master Smith",
    bio: "Veteran warrior of the Deepcrag Halls. Carrying an ancestral runic battleaxe and indomitable grit, he fears neither beast nor shadow-sorcerer.",
    quote: "Let Malakar hide in the dark! My axe sparks bright enough!",
    icon: "🪓",
    color: "from-orange-500/20 to-red-600/10 border-orange-500/40 text-orange-300",
    trait: "+Tenacity & Fortitude",
  },
  {
    id: "soraya",
    name: "Soraya",
    title: "The Astral Arcanist",
    role: "Scholar of Ancient Ley Spells",
    bio: "Weaver of celestial light and purification wards. Her deep knowledge of forbidden glyphs holds the key to piercing Malakar's dark fortress.",
    quote: "Magic is neither cruel nor kind; it is the truth of our will.",
    icon: "🔮",
    color: "from-purple-500/20 to-indigo-600/10 border-purple-500/40 text-purple-300",
    trait: "+Arcana & Purification",
  },
];

// Interactive demo scenarios for landing page simulator
interface SimulatorScenario {
  npc: string;
  location: string;
  role: string;
  image: string;
  beat: string;
  question: string;
  options: {
    text: string;
    isAlly: boolean;
    reason: string;
  }[];
}

const DEMO_SCENARIOS: SimulatorScenario[] = [
  {
    npc: "Dareth",
    location: "Rivergate Tavern",
    role: "Tavern Keeper",
    image: imageDining,
    beat: "Dareth wipes down a scarred oak counter as you step inside out of the twilight. Whispers cease among the patron guards.",
    question: "They say King Alden's knights fled the fortress with their tails between their legs. Why should we risk our harvest for an empty throne?",
    options: [
      {
        text: "The King has not abandoned Eldoria; four champions march on Shadowmoor as we speak to reclaim what was stolen.",
        isAlly: true,
        reason: "Dareth's eyes light up with renewed hope. He slides a mug across the table and vows his village's allegiance.",
      },
      {
        text: "Keep your meager grains if you must, coward. When Malakar's wraiths arrive, your coin won't save you.",
        isAlly: false,
        reason: "Dareth scowls deeply and gestures toward the door. The tavern patrons turn their backs in bitter anger.",
      },
      {
        text: "I ask only for passage and shelter. Whatever fate befalls the crown, your hospitality will be remembered.",
        isAlly: true,
        reason: "Dareth nods cautiously, appreciating your calm respect. He shares whispers about a hidden mountain pass.",
      },
    ],
  },
  {
    npc: "Captain Valen",
    location: "Ironclad Stronghold",
    role: "Garrison Commander",
    image: imageHall,
    beat: "Iron torches illuminate the high hall. Valen stands over a war map studded with black iron markers.",
    question: "We hold the western pass, but my men grow weary of phantom alarms. What proof have you that the sorcerer moves toward our gates?",
    options: [
      {
        text: "The Shadowmoor corruption is already poisoning the eastern wells. Stand with us, Captain, and we will break his vanguard together.",
        isAlly: true,
        reason: "Valen pounds his fist onto the table with conviction. He pledges fifty heavy cavalry to your cause.",
      },
      {
        text: "If your men tremble at shadows, perhaps Eldoria needs real soldiers guarding its borders.",
        isAlly: false,
        reason: "Valen's jaw tightens. He orders his guards to escort you off the ramparts into the cold rain.",
      },
      {
        text: "I bring no army, only the truth: every hour we delay, the Emerald Crown feeds Malakar's dark ritual.",
        isAlly: true,
        reason: "Valen listens intently and offers his master scout to guide you through the perilous crags.",
      },
    ],
  },
  {
    npc: "Lyra the Herbalist",
    location: "Silverwood Outpost",
    role: "Forest Mystic",
    image: imageCityStreet,
    beat: "Baskets of dried nightshade and silverfern hang from low wooden eaves. Lyra tends a simmering brass cauldron.",
    question: "Traveller, the road ahead is fraught with cursed mist. Many who seek glory leave only their bones behind.",
    options: [
      {
        text: "We seek not glory, but peace for those who cannot defend themselves against the dark.",
        isAlly: true,
        reason: "Lyra smiles softly and hands you a vial of luminous elder-salve to ward off shadow curses.",
      },
      {
        text: "Stay out of my way, old witch. I don't need your riddles or your superstitions.",
        isAlly: false,
        reason: "Lyra vanishes behind heavy curtains. A chilling draft snuffs out your lantern in the street.",
      },
      {
        text: "Every perilous journey requires caution. Will you share the secrets of the Silverwood mist?",
        isAlly: true,
        reason: "Impressed by your humility, Lyra marks the safe forest ley lines onto your map.",
      },
    ],
  },
];

const FAQS = [
  {
    q: "What is Literal Storyboard?",
    a: "Literal Storyboard is an autonomous AI Game Agent and interactive fantasy RPG created for the AWS Game Builder Hackathon. It orchestrates dynamic story beats, real-time visual scene generation, procedural cartography, and sentiment-based diplomacy mechanics.",
  },
  {
    q: "How does the AI Game Agent & Sentiment Mechanic work?",
    a: "Every city you visit on the procedural route generates a fresh narrative beat and moral dilemma powered by Google Gemini 3.7 Flash. When you respond, the Sentiment Arbiter agent evaluates the semantic tone and morality of your words: supportive, kind, and brave answers win Allies (+1), while hostile or cynical responses create Enemies (+1). Leading by 3 allies wins the realm; falling behind by 3 allies causes Eldoria to turn away.",
  },
  {
    q: "Do I need an OpenRouter API key to play?",
    a: "No! Literal Storyboard is fully playable out of the box without any API key. The game automatically falls back to curated high-fantasy story arcs and bundled artwork. Adding an OpenRouter key to your `.env` unlocks infinite live generative stories and dynamically painted 16:9 scene backgrounds.",
  },
  {
    q: "Can I swap the underlying AI models?",
    a: "Yes! Literal Storyboard features a pluggable architecture via OpenRouter. You can point the story generation, sentiment arbiter, and scene painter to any model on OpenRouter (such as Claude Haiku 4.5, GPT-5.4-mini, or Flux.2) simply by updating `src/ai_handler/models.ts`.",
  },
  {
    q: "What technologies power this project?",
    a: "The project is built with React 19, TypeScript, Vite 8, Tailwind CSS v4, AWS Amplify hosting, OpenRouter API (Gemini 3.7 Flash & Gemini 3.1 Flash Lite Image), and the Fantasy Map Generator procedural engine.",
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onStartGame, winMargin }) => {
  // Embarkation form state
  const [username, setUsername] = useState("");
  const [boardSize, setBoardSize] = useState(8);
  const [selectedCompanion, setSelectedCompanion] = useState<string>("roderick");
  const [formError, setFormError] = useState("");

  // Interactive Simulator state
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null);
  const [simVerdict, setSimVerdict] = useState<{ isAlly: boolean; reason: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentScenario = DEMO_SCENARIOS[activeScenarioIdx];

  const handleLaunchGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setFormError("Please enter a name for your traveller.");
      return;
    }
    setFormError("");
    onStartGame(username.trim(), boardSize, selectedCompanion);
  };

  const handleSimulateAnswer = (optionIdx: number) => {
    setSimSelectedOption(optionIdx);
    const chosen = currentScenario.options[optionIdx];
    setSimVerdict({
      isAlly: chosen.isAlly,
      reason: chosen.reason,
    });
  };

  const resetSimulator = (nextIdx: number) => {
    setActiveScenarioIdx(nextIdx);
    setSimSelectedOption(null);
    setSimVerdict(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 selection:bg-amber-500 selection:text-black">
      <SEO
        title="Literal Storyboard — AI Fantasy Game Agent & Interactive Storytelling RPG"
        description="Experience autonomous AI storytelling in Eldoria. Dynamic Gemini-powered game agents generate story beats, paint living scene backgrounds, and judge player morality via tone sentiment mechanics."
      />

      {/* ---------------------------------------------------------------------
          HERO SECTION
      --------------------------------------------------------------------- */}
      <header className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-amber-500/20">
        {/* Background Fantasy Map with Dark Gradient Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: `url(${fantasyMap})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/90 via-[#0a0a0f]/75 to-[#0a0a0f] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/15 via-purple-900/10 to-transparent pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badges */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  AWS Game Builder Hackathon
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span>✨</span> Powered by Gemini 3.7 Flash & OpenRouter
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none">
                <span className="block font-cinzel text-white drop-shadow-md">
                  LITERAL
                </span>
                <span className="block font-cinzel text-gold-gradient drop-shadow-lg">
                  STORYBOARD
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                Step into <strong className="text-amber-300 font-medium">Eldoria</strong>, a living realm where autonomous AI agents weave reactive narrative beats, paint dynamically generated scenery, and weigh the moral tone of your words to crown heroes or forge enemies.
              </p>

              {/* Quick Feature Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-amber-500/20 backdrop-blur-sm">
                  <div className="text-amber-400 text-lg mb-1">🎭</div>
                  <div className="text-xs font-semibold text-white">AI Story Beats</div>
                  <div className="text-[11px] text-slate-400">Gemini 3.7 Flash</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-emerald-500/20 backdrop-blur-sm">
                  <div className="text-emerald-400 text-lg mb-1">🎨</div>
                  <div className="text-xs font-semibold text-white">Scene Painter</div>
                  <div className="text-[11px] text-slate-400">Nano Banana 2</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/20 backdrop-blur-sm col-span-2 sm:col-span-1">
                  <div className="text-purple-400 text-lg mb-1">⚖️</div>
                  <div className="text-xs font-semibold text-white">Sentiment Arbiter</div>
                  <div className="text-[11px] text-slate-400">Allies vs Enemies</div>
                </div>
              </div>

              {/* Hero Call-to-Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#embark"
                  className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
                >
                  <span>⚔️</span> Embark on Quest
                </a>
                <a
                  href="#agent-simulator"
                  className="px-6 py-3.5 rounded-xl font-semibold text-amber-200 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 backdrop-blur-sm transition-all duration-200 flex items-center gap-2 text-base"
                >
                  <span>🔮</span> Try Agent Simulator
                </a>
                <a
                  href="#lore"
                  className="px-5 py-3.5 rounded-xl font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors text-sm"
                >
                  Explore Lore ↓
                </a>
              </div>

              {/* Status Note */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 pt-2">
                <span className={`h-2 w-2 rounded-full ${hasApiKey ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span>
                  {hasApiKey
                    ? "Live AI Engine Active (OpenRouter Connected)"
                    : "Instant Playable Mode Ready (Offline High-Fantasy Engine)"}
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Card / Interactive Preview Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden gilded-border-glow bg-slate-950/80 backdrop-blur-md shadow-2xl p-4 sm:p-6 space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-amber-300/80 ml-2">Eldoria Realm Agent v1.0</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Live Simulator
                  </span>
                </div>

                {/* City & Character Preview Mockup */}
                <div className="relative rounded-xl overflow-hidden h-52 sm:h-60 border border-amber-500/30">
                  <img
                    src={imageHarbour}
                    alt="Fantasy City Arrival"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Floating Token & City Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-black/70 text-xs font-bold text-yellow-400 border border-yellow-500/40">
                      📍 Oakhaven City
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[11px] text-emerald-300 border border-emerald-500/30">
                      NPC: Guard Captain
                    </span>
                  </div>

                  {/* Character Avatar */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-amber-500/30">
                    <img src={characterImg} alt="Player Token" className="w-8 h-8 rounded-full border border-yellow-400 object-cover" />
                    <div className="text-left text-xs">
                      <p className="font-bold text-white leading-none">Your Traveller</p>
                      <p className="text-[10px] text-amber-300">Leading by +2 Allies</p>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 max-w-[60%]">
                    <p className="text-xs text-slate-200 line-clamp-2 italic drop-shadow">
                      "Speak plain, traveller. Malakar's agents lurk behind every shadow in this harbor."
                    </p>
                  </div>
                </div>

                {/* Score & Sentiment Balance Indicator */}
                <div className="space-y-2 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-emerald-400 flex items-center gap-1">🤝 Allies: 2</span>
                    <span className="text-amber-400 font-cinzel">Tug of War (+{winMargin} to Win)</span>
                    <span className="text-rose-400 flex items-center gap-1">⚔️ Enemies: 0</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-500 w-[66%]" />
                    <div className="h-full bg-rose-600 transition-all duration-500 w-[34%]" />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center italic">
                    AI Sentiment Arbiter: "Your words showed reverence to Eldoria's laws."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Real-time Ticker / Metric Bar */}
        <div className="border-t border-amber-500/20 bg-slate-950/70 backdrop-blur-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-800/80">
              <div className="px-2">
                <p className="text-xl sm:text-2xl font-extrabold text-amber-400 font-cinzel">100%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Procedural Cartography</p>
              </div>
              <div className="px-2">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-cinzel">Gemini 3.7</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Flash Story Engine</p>
              </div>
              <div className="px-2">
                <p className="text-xl sm:text-2xl font-extrabold text-purple-400 font-cinzel">&lt; 500ms</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Sentiment Analysis</p>
              </div>
              <div className="px-2">
                <p className="text-xl sm:text-2xl font-extrabold text-yellow-400 font-cinzel">Zero Setup</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Free Offline & Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------
          INTERACTIVE AI AGENT SIMULATOR SANDBOX
      --------------------------------------------------------------------- */}
      <section id="agent-simulator" className="py-20 bg-gradient-to-b from-[#0a0a0f] via-slate-950 to-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Live Agent Sandbox
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
              Experience the <span className="text-gold-gradient">AI Game Agent</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Try a dialogue exchange with an Eldorian inhabitant below. Choose your words carefully — our AI Sentiment Arbiter evaluates the morality and tone of your reply in real time.
            </p>
          </div>

          {/* Sandbox Widget Card */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-2xl gilded-border-glow overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Scenario Switcher Tabs */}
            <div className="flex border-b border-amber-500/20 bg-black/40 overflow-x-auto">
              {DEMO_SCENARIOS.map((scen, idx) => (
                <button
                  key={scen.npc}
                  onClick={() => resetSimulator(idx)}
                  className={`flex-1 min-w-[160px] py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    activeScenarioIdx === idx
                      ? "bg-amber-500/20 text-yellow-300 border-b-2 border-yellow-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span>📍</span> {scen.npc} ({scen.role})
                </button>
              ))}
            </div>

            {/* Sandbox Main Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Scene Backdrop & Story Beat */}
              <div className="relative rounded-xl overflow-hidden min-h-[160px] sm:min-h-[180px] flex items-end p-5 border border-amber-500/30">
                <img
                  src={currentScenario.image}
                  alt={currentScenario.location}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
                
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-yellow-400 uppercase tracking-wider font-semibold">
                    <span>{currentScenario.location}</span>
                    <span>•</span>
                    <span>Encounter with {currentScenario.npc}</span>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {currentScenario.beat}
                  </p>
                </div>
              </div>

              {/* The NPC's Question / Dilemma */}
              <div className="bg-black/60 p-4 rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-cinzel">
                  <span>🗣️</span> {currentScenario.npc} asks:
                </div>
                <p className="text-base sm:text-lg font-medium text-white italic">
                  "{currentScenario.question}"
                </p>
              </div>

              {/* Dialogue Response Options */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select your response:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentScenario.options.map((opt, idx) => {
                    const isSelected = simSelectedOption === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSimulateAnswer(idx)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? opt.isAlly
                              ? "bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow-md shadow-emerald-900/30"
                              : "bg-rose-950/60 border-rose-400 text-rose-100 shadow-md shadow-rose-900/30"
                            : "bg-slate-950/70 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 text-slate-200"
                        }`}
                      >
                        <span className="text-xs mt-0.5 px-2 py-0.5 rounded bg-black/50 text-slate-400 border border-slate-700 font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Arbiter Evaluation Result */}
              {simVerdict && (
                <div
                  className={`p-4 rounded-xl border ls-pop-in space-y-2 ${
                    simVerdict.isAlly
                      ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-200"
                      : "bg-rose-950/80 border-rose-500/60 text-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-2 text-sm font-cinzel">
                      {simVerdict.isAlly ? "🤝 ALLY GAINED (+1)" : "⚔️ ENEMY CREATED (+1)"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-current">
                      AI Sentiment Verdict
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                    {simVerdict.reason}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          THE FOUR CORE AI AGENT PILLARS
      --------------------------------------------------------------------- */}
      <section id="agents" className="py-20 bg-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Agentic Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
              The Four Pillars of <span className="text-gold-gradient">Literal Storyboard</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Engineered with specialized AI agents and procedural subsystems to craft an infinitely replayable, narrative-driven fantasy experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="fantasy-card rounded-2xl p-6 space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📜
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Engine 01</span>
                <h3 className="text-xl font-bold font-cinzel text-white">AI Storyteller Agent</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Powered by <strong className="text-amber-300">Google Gemini 3.7 Flash</strong> via OpenRouter. Formulates contextual narrative beats and reactive character dialogue for every procedural settlement.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                JSON-Schema Strict Outputs
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="fantasy-card rounded-2xl p-6 space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎨
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Engine 02</span>
                <h3 className="text-xl font-bold font-cinzel text-white">Scene Painter Agent</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Synthesizes custom 16:9 scenic artwork dynamically for each story beat using <strong className="text-emerald-300">Gemini 3.1 Flash Lite Image</strong>, rendering breathtaking vistas that fade in as you read.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                16:9 Real-time Generation
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="fantasy-card rounded-2xl p-6 space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Engine 03</span>
                <h3 className="text-xl font-bold font-cinzel text-white">Sentiment Arbiter</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Analyzes semantic nuance and player tone. Compassion and chivalry rally townsfolk (+1 Ally), while callous greed sows distrust (+1 Enemy), maintaining a dynamic tug-of-war.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                Tug of War Morality (+3 Win)
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="fantasy-card rounded-2xl p-6 space-y-4 relative group">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🗺️
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Engine 04</span>
                <h3 className="text-xl font-bold font-cinzel text-white">Procedural Map Engine</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Integrated with the <strong className="text-yellow-300">Fantasy Map Generator</strong>. Computes coordinate-relative paths and city milestones so campaigns scale seamlessly across any display size.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                8–32 Dynamic City Routes
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          LORE OF ELDORIA & THE FOUR HEROES
      --------------------------------------------------------------------- */}
      <section id="lore" className="py-20 bg-gradient-to-b from-[#0a0a0f] via-slate-950 to-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Chronicles of the Realm
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
              The Legend of <span className="text-gold-gradient">Eldoria</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              The ancient peace upheld by the divine <strong>Emerald Crown</strong> lies shattered. The sorcerer <strong>Malakar</strong> has stolen the relic into the blighted Shadowmoor. Four legendary champions ride forth — and you follow in their wake.
            </p>
          </div>

          {/* Hero Companions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HERO_COMPANIONS.map((hero) => (
              <div
                key={hero.id}
                className={`rounded-2xl p-6 border bg-gradient-to-b transition-all duration-300 hover:-translate-y-1 space-y-4 ${hero.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{hero.icon}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 font-semibold">
                    {hero.trait}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-cinzel text-white">{hero.name}</h3>
                  <p className="text-xs font-medium text-amber-300/90">{hero.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{hero.role}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {hero.bio}
                </p>

                <div className="pt-3 border-t border-white/10 text-xs italic text-slate-400">
                  "{hero.quote}"
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------------
          EMBARKATION STATION / CHARACTER LAUNCHER FORM
      --------------------------------------------------------------------- */}
      <section id="embark" className="py-20 bg-[#0a0a0f] border-b border-amber-500/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-yellow-300 border border-amber-500/40">
              Interactive Game Launcher
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
              Embark on Your <span className="text-gold-gradient">Journey</span>
            </h2>
            <p className="text-slate-300 text-sm">
              Prepare your traveller, configure the route length across Eldoria, and ride out into the story.
            </p>
          </div>

          <form
            onSubmit={handleLaunchGame}
            className="p-6 sm:p-10 rounded-2xl gilded-border-glow bg-slate-900/95 backdrop-blur-xl shadow-2xl space-y-6"
          >
            {/* Traveller Name */}
            <div className="space-y-2">
              <label htmlFor="landing-username" className="block text-sm font-semibold text-amber-300 font-cinzel">
                Traveller Name or Title
              </label>
              <input
                id="landing-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Aedan the Just, Lyanna of Oakhaven"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              {formError && <p className="text-xs text-rose-400 font-medium">{formError}</p>}
            </div>

            {/* Choose Companion Vanguard */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-amber-300 font-cinzel">
                Select Your Companion Archetype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HERO_COMPANIONS.map((hero) => {
                  const isSelected = selectedCompanion === hero.id;
                  return (
                    <button
                      type="button"
                      key={hero.id}
                      onClick={() => setSelectedCompanion(hero.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 ${
                        isSelected
                          ? "bg-amber-500/20 border-yellow-400 text-white shadow-md shadow-amber-500/20"
                          : "bg-slate-950/70 border-slate-800 hover:border-amber-500/40 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl">{hero.icon}</span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400 text-black font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold font-cinzel text-white leading-tight">{hero.name}</p>
                        <p className="text-[10px] text-amber-300/80">{hero.title.split(" ")[1] || hero.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Length Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="landing-boardsize" className="block text-sm font-semibold text-amber-300 font-cinzel">
                  Cities on the Route (8–32)
                </label>
                <select
                  id="landing-boardsize"
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
                >
                  <option value={8}>8 Cities — Quick Skirmish (~5 mins)</option>
                  <option value={12}>12 Cities — Standard Quest (~10 mins)</option>
                  <option value={16}>16 Cities — Extended Campaign (~15 mins)</option>
                  <option value={24}>24 Cities — Epic Odyssey (~25 mins)</option>
                  <option value={32}>32 Cities — Grand Realm Saga (~35 mins)</option>
                </select>
              </div>

              {/* Win Margin Rule Info */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/20 flex flex-col justify-center text-xs text-slate-300 space-y-1">
                <div className="text-amber-400 font-bold font-cinzel flex items-center gap-1.5">
                  <span>⚖️</span> Victory Condition
                </div>
                <p>
                  Reach <strong className="text-emerald-300">+{winMargin} Allies</strong> ahead of Enemies to restore the Emerald Crown. If enemies lead by {winMargin}, the realm falls.
                </p>
              </div>
            </div>

            {/* API Mode Callout */}
            {!hasApiKey && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <p>
                  <strong>Play Offline or Free:</strong> You are ready to play with bundled stories and high-definition fantasy artwork! To enable live generative AI storytelling and scene painting, add a <code>VITE_OPENROUTER_API_KEY</code> to <code>.env</code>.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/20 text-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>⚔️</span> Launch Quest & Begin Adventure
            </button>
          </form>

        </div>
      </section>

      {/* ---------------------------------------------------------------------
          HOW TO PLAY & THE GAME LOOP
      --------------------------------------------------------------------- */}
      <section id="how-to-play" className="py-20 bg-gradient-to-b from-[#0a0a0f] via-slate-950 to-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Game Loop
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
              How to Play <span className="text-gold-gradient">Literal Storyboard</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A frictionless turn-based adventure blending classic board mechanics with generative AI storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-cinzel font-bold flex items-center justify-center text-lg border border-amber-500/40">
                1
              </div>
              <h3 className="text-lg font-bold font-cinzel text-white">Roll & Traverse</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Roll the dice (1–6) on your turn to walk your party token city by city across the procedurally generated fantasy map.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-cinzel font-bold flex items-center justify-center text-lg border border-emerald-500/40">
                2
              </div>
              <h3 className="text-lg font-bold font-cinzel text-white">Encounter NPCs</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enter visual-novel mode upon arrival. Inhabitants share local lore, rumors of Malakar, and pose moral questions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-cinzel font-bold flex items-center justify-center text-lg border border-purple-500/40">
                3
              </div>
              <h3 className="text-lg font-bold font-cinzel text-white">Speak Wisely</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose your response. The AI Sentiment Arbiter evaluates your ethical tone — supportive words win allies, cruelty makes enemies.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 font-cinzel font-bold flex items-center justify-center text-lg border border-yellow-500/40">
                4
              </div>
              <h3 className="text-lg font-bold font-cinzel text-white">Lead by 3 to Win</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Maintain a +3 Ally margin to rally the realm and reclaim the Emerald Crown. Fall behind by 3 and the realm turns away.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          TECHNOLOGY STACK & ARCHITECTURE
      --------------------------------------------------------------------- */}
      <section id="tech-stack" className="py-20 bg-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Modern Tech Foundation
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
              Built with <span className="text-gold-gradient">State of the Art</span> Tools
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A high-performance web architecture optimized for rapid inference, responsive cartography, and scalable cloud deployment.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "React 19", role: "UI Framework", icon: "⚛️" },
              { name: "TypeScript", role: "Type Safety", icon: "🔷" },
              { name: "Vite 8", role: "Build Tooling", icon: "⚡" },
              { name: "Tailwind CSS 4", role: "Design System", icon: "🎨" },
              { name: "Gemini 3.7", role: "Story AI Model", icon: "✨" },
              { name: "OpenRouter", role: "Multi-Model API", icon: "🌐" },
              { name: "AWS Amplify", role: "Cloud Hosting", icon: "☁️" },
              { name: "Map Generator", role: "Procedural Engine", icon: "🗺️" },
              { name: "Nano Banana", role: "Scene Synthesis", icon: "🖼️" },
              { name: "JSON Schema", role: "Structured AI", icon: "📋" },
              { name: "Docker", role: "Containerized", icon: "🐳" },
              { name: "React Router 7", role: "Client Routing", icon: "🧭" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-colors text-center space-y-1"
              >
                <div className="text-2xl mb-1">{tech.icon}</div>
                <div className="text-xs font-bold text-white font-cinzel">{tech.name}</div>
                <div className="text-[11px] text-slate-400">{tech.role}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------------
          FREQUENTLY ASKED QUESTIONS (FAQ)
      --------------------------------------------------------------------- */}
      <section id="faq" className="py-20 bg-gradient-to-b from-[#0a0a0f] via-slate-950 to-[#0a0a0f] border-b border-amber-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-cinzel font-semibold text-sm sm:text-base text-white hover:text-amber-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-amber-400 font-mono text-lg">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------------
          FOOTER
      --------------------------------------------------------------------- */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                <span className="font-cinzel font-bold text-lg text-white">Literal Storyboard</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                An innovative AI game agent RPG combining OpenRouter, Google Gemini 3.7 Flash storytelling, real-time sentiment analysis, and procedural fantasy map generation.
              </p>
              <p className="text-xs text-amber-400/80 font-medium">
                Created for the AWS Game Builder Hackathon.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200 font-cinzel">Quick Navigation</p>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#embark" className="hover:text-amber-300 transition-colors">Start Quest</a></li>
                <li><a href="#agent-simulator" className="hover:text-amber-300 transition-colors">AI Agent Sandbox</a></li>
                <li><a href="#agents" className="hover:text-amber-300 transition-colors">Agent Architecture</a></li>
                <li><a href="#lore" className="hover:text-amber-300 transition-colors">Eldoria Lore</a></li>
                <li><Link to="/about" className="hover:text-amber-300 transition-colors">About Project</Link></li>
              </ul>
            </div>

            {/* Resources & Open Source */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200 font-cinzel">Open Source & APIs</p>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="https://github.com/thirza258/literal-storyboard"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>GitHub Repository</span> ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://openrouter.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>OpenRouter AI</span> ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://aws.amazon.com/amplify/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>AWS Amplify</span> ↗
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Literal Storyboard Team. Distributed under MIT License.</p>
            <p className="flex items-center gap-4">
              <span>Kingdom of Eldoria</span>
              <span>•</span>
              <a href="#top" className="hover:text-amber-300 transition-colors">Back to Top ↑</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
