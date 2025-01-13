
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MatrixBoard from "./components/MatrixBoard";
import Character from "./components/Character";
import Novel from "./components/Novel";
import GameTab from "./components/GameTab";
import Login from "./components/Login";
import About from "./components/About";

interface Board {
  name: string;
  assign: number;
  X_location: number;
  Y_location: number;
}

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [index, setIndex] = useState(0);
  const [boardSize] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [storyNow, setStoryNow] = useState(false);
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const handleProgressUpdate = (newProgress: number) => {
    setIndex((prevIndex) => prevIndex + newProgress);
    setStoryNow(true);
    if(storyNow === true){
      navigate('/novel');
    }
  };

  useEffect(() => {

    const generateNonOverlappingPosition = (
      existingBoards: Board[],
      containerWidth: number,
      containerHeight: number
    ) => {
      let position: { X_location: number; Y_location: number };
      let overlap;
      do {
        position = {
          X_location:
            0.2 * containerWidth + Math.random() * (containerWidth * 0.6), // 20% to 80% of width
          Y_location:
            0.1 * containerHeight + Math.random() * (containerHeight * 0.7), // 10% to 80% of height
        };
        overlap = existingBoards.some(
          (board) =>
            Math.abs(board.X_location - position.X_location) < 50 &&
            Math.abs(board.Y_location - position.Y_location) < 50
        );
      } while (overlap);
      return position;
    };

    const generateRandomBoards = () => {
      if (!containerRef.current) {
        console.warn('Container ref is not available.');
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight * 0.7; // 70% of container's height
      console.log(containerWidth, containerHeight);

      const boards: Board[] = [];
      for (let i = 0; i < boardSize * boardSize; i++) {
        const position = generateNonOverlappingPosition(
          boards,
          containerWidth,
          containerHeight
        );
        boards.push({
          name: `Board ${i + 1}`,
          assign: i + 1,
          ...position,
        });
      }
      setBoards(boards);
    };

    generateRandomBoards();

    const handleResize = () => {
      generateRandomBoards(); 
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Clean up event listener
  }, [boardSize]);

  console.log(boards)

  const isLoggedIn = username.trim() !== '';

  return (
    <div className="bg-[#3000BE]">
    <Router>
      <NavBar username={username} />
      <div className="flex mt-10">
        <Sidebar />
        <div className="flex-1 p-4 overflow-auto" ref={containerRef}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="relative">
                  <MatrixBoard boards={boards} />
                  <Character boards={boards} index={index} />
                  <div className="mt-4">
                    <GameTab onRoll={handleProgressUpdate} />
                  </div>
                </div>
              }
            />
            <Route path="/novel" element={<Novel />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login setUsername={setUsername} />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
