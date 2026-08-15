import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MatrixBoard from "./components/MatrixBoard";
import Character from "./components/Character";
import Novel from "./components/Novel";
import GameTab from "./components/GameTab";
import Login from "./components/Login";
import About from "./components/About";
import Outcome from "./components/Winner";
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
   * The route is laid out once, when the game starts. It used to be rebuilt on
   * every window resize, which reshuffled the city names and positions
   * mid-run — positions are fractions of the map now, so a resize costs nothing.
   */
  const handleStart = useCallback((name: string, size: number) => {
    setBoardSize(size);
    setBoards(buildRoute(size));
    setIndex(0);
    setUsername(name);
  }, []);

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

  if (username.trim() === "") {
    return <Login onStart={handleStart} winMargin={WIN_MARGIN} />;
  }

  // Derived, not stored: the old build checked the win condition inside the roll
  // handler against stale scores, and its navigate() raced a queued one.
  let outcome: OutcomeKind | null = null;
  if (allies >= enemies + WIN_MARGIN) outcome = "victory";
  else if (enemies >= allies + WIN_MARGIN) outcome = "defeat";

  const currentCity = boards[index]?.name ?? "the road";

  return (
    <div>
      <NavBar username={username} allies={allies} enemies={enemies} />
      <div className="flex mt-12">
        <Sidebar />
        <div className="flex-1 p-4 ml-32 overflow-auto">
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
                  <div className="ls-fade-in">
                    <div className="relative">
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
                  <Novel city={currentCity} npc={npc} onAnswer={handleAnswer} />
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
