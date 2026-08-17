import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MatrixBoard from "./components/MatrixBoard";
import Character from "./components/Character";
import Novel from "./components/Novel";
import GameTab from "./components/GameTab";
import About from "./components/About";
import Outcome from "./components/Winner";
import LandingPage from "./components/LandingPage";
import SEO from "./components/SEO";
import { gradeAnswer, type SentimentVerdict } from "./ai_handler/sentiment";
import { buildRoute, type Board } from "./game/board";
import { randomNpc, type Npc } from "./game/npc";

/** How far ahead of your opponent you must be for the game to end. */
const WIN_MARGIN = 3;

/** Milliseconds the token spends travelling between two cities. */
const STEP_MS = 420;

export type OutcomeKind = "victory" | "defeat";

function App() {
  const [username, setUsername] = useState("");
  const [boardSize, setBoardSize] = useState(8);
  const [boards, setBoards] = useState<Board[]>([]);
  const [index, setIndex] = useState(0);
  const [npc, setNpc] = useState<Npc>("Villager");

  const [allies, setAllies] = useState(0);
  const [enemies, setEnemies] = useState(0);
  const [verdict, setVerdict] = useState<SentimentVerdict | null>(null);

  const [isMoving, setIsMoving] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);

  const timers = useRef<number[]>([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Read inside timeouts, which would otherwise close over a stale route.
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /**
   * The route is laid out once, when the game starts. Positions are fractions
   * of the map, so a window resize costs nothing.
   */
  const handleStart = useCallback((name: string, size: number) => {
    setBoardSize(size);
    setBoards(buildRoute(size));
    setIndex(0);
    setAllies(0);
    setEnemies(0);
    setVerdict(null);
    setIsMoving(false);
    setLastRoll(0);
    setUsername(name);
    navigate("/");
  }, [navigate]);

  /** Exit active run back to Landing page overview */
  const handleExitToMenu = useCallback(() => {
    clearTimers();
    setUsername("");
    setIsMoving(false);
    setVerdict(null);
    navigate("/");
  }, [clearTimers, navigate]);

  /** Walks the token one city at a time, then opens the story where it landed. */
  const handleRoll = useCallback(
    (steps: number) => {
      if (isMoving || boards.length === 0) return;

      setLastRoll(steps);
      setIsMoving(true);
      setVerdict(null);

      let walked = 0;
      const stepOnce = () => {
        setIndex((prev) => (prev + 1) % boards.length);
        walked += 1;

        if (walked < steps) {
          timers.current.push(window.setTimeout(stepOnce, STEP_MS));
        } else {
          timers.current.push(
            window.setTimeout(() => {
              setIsMoving(false);
              // Don't yank the player out of About if they wandered off mid-trip.
              if (pathnameRef.current !== "/") return;
              setNpc(randomNpc());
              navigate("/novel");
            }, STEP_MS + 220)
          );
        }
      };

      // Give the dice a moment to settle before the token starts walking.
      timers.current.push(window.setTimeout(stepOnce, 550));
    },
    [boards.length, isMoving, navigate]
  );

  /** Grades the chosen reply, then returns the player to the map. */
  const handleAnswer = useCallback(
    async (answer: string) => {
      const result = await gradeAnswer({ input: answer });
      clearTimers();
      setVerdict(result);
      if (result.sentiment) {
        setAllies((prev) => prev + 1);
      } else {
        setEnemies((prev) => prev + 1);
      }
      navigate("/");
    },
    [clearTimers, navigate]
  );

  const handleRestart = useCallback(() => {
    clearTimers();
    setAllies(0);
    setEnemies(0);
    setVerdict(null);
    setIsMoving(false);
    setLastRoll(0);
    setIndex(0);
    setBoards(buildRoute(boardSize));
    navigate("/");
  }, [boardSize, clearTimers, navigate]);

  // If no active run has started yet, show Landing Page or About page
  if (username.trim() === "") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<LandingPage onStartGame={handleStart} winMargin={WIN_MARGIN} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  // Active game session
  let outcome: OutcomeKind | null = null;
  if (allies >= enemies + WIN_MARGIN) outcome = "victory";
  else if (enemies >= allies + WIN_MARGIN) outcome = "defeat";

  const currentCity = boards[index]?.name ?? "the road";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <NavBar
        username={username}
        allies={allies}
        enemies={enemies}
        onExitGame={handleExitToMenu}
      />
      <div className="flex pt-14">
        <Sidebar onExitToMenu={handleExitToMenu} />
        <main className="flex-1 p-4 ml-36 overflow-auto min-h-[calc(100vh-3.5rem)]">
          {outcome ? (
            <Outcome
              outcome={outcome}
              allies={allies}
              enemies={enemies}
              onRestart={handleRestart}
            />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <div className="ls-fade-in space-y-4 max-w-6xl mx-auto">
                    <SEO
                      title={`${username}'s Quest at ${currentCity} — Literal Storyboard`}
                      description={`Currently travelling across Eldoria at ${currentCity}. Allies: ${allies}, Enemies: ${enemies}.`}
                    />
                    <div className="relative rounded-2xl overflow-hidden gilded-border-glow shadow-2xl">
                      <MatrixBoard boards={boards} activeIndex={index} />
                      <Character boards={boards} index={index} moving={isMoving} />
                    </div>
                    <GameTab
                      onRoll={handleRoll}
                      allies={allies}
                      enemies={enemies}
                      winMargin={WIN_MARGIN}
                      isMoving={isMoving}
                      lastRoll={lastRoll}
                      currentCity={currentCity}
                      verdict={verdict}
                    />
                  </div>
                }
              />
              <Route
                path="/novel"
                element={
                  <div className="max-w-5xl mx-auto">
                    <SEO
                      title={`Encounter at ${currentCity} with ${npc} — Literal Storyboard`}
                      description={`Face a narrative dilemma with ${npc} at ${currentCity} in the realm of Eldoria.`}
                    />
                    <Novel city={currentCity} npc={npc} onAnswer={handleAnswer} />
                  </div>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
