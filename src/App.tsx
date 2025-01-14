import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MatrixBoard from "./components/MatrixBoard";
import Character from "./components/Character";
import Novel from "./components/Novel";
import GameTab from "./components/GameTab";
import Login from "./components/Login";
import About from "./components/About";
import { run } from "./ai_handler/sentiment";
import WinPage from "./components/Winner";

interface Board {
  name: string;
  assign: number;
  X_location: number;
  Y_location: number;
}

interface SentimentResponse {
  sentiment: boolean;
}

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [index, setIndex] = useState(0);
  const [boardSize, setBoardSize] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);
  const [storyNow, setStoryNow] = useState(false);
  const [username, setUsername] = useState("");
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [allies, setAllies] = useState(0);
  const [enemies, setEnemies] = useState(0);

  console.log(sentiment);
  console.log(storyNow);

  const navigate = useNavigate();

  const handleProgressUpdate = (newProgress: number) => {
    setIndex((prevIndex) => {
      const newIndex = prevIndex + newProgress;
      return newIndex >= boardSize ? newIndex - boardSize : newIndex;
    });
    setTimeout(() => {
      setStoryNow(true);
      navigate("/novel");
    }, 2000);

    if(allies >= 3 + enemies) {
      navigate("/winner");
    }
  };

  const validateSentimentResponse = (data: any): data is SentimentResponse => {
    return data && typeof data.sentiment === "boolean";
  };

  const handleAnswer = async (answer: string) => {
    setStoryNow(false);
    const response = await run({ input: answer });
    const responseText = response.response.text();
    console.log(responseText);
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("Failed to parse JSON response");
    }

    if (!validateSentimentResponse(parsedData)) {
      throw new Error("Invalid story data structure");
    }

    setSentiment(parsedData);

    if (parsedData.sentiment) {
      setAllies((prevAllies) => prevAllies + 1);
    } else {
      setEnemies((prevEnemies) => prevEnemies + 1);
    }

    navigate("/");
  };

  const listOfCities: string[] = [
    "Emberfall",
    "Silverhaven",
    "Stonebridge",
    "Whisperwind",
    "Ironhold",
    "Sunstone",
    "Moonwhisper",
    "Riverbend",
    "Oakhaven",
    "Shadowfen",
    "Frostpeak",
    "Gildedreach",
    "Stormwatch",
    "Veridian",
    "Crimsonhold",
    "Azureport",
    "Mistywood",
    "Coralcoast",
    "Obsidian",
    "Dragon's Tooth",
    "Ebonreach",
    "Starfall",
    "Sunkenkeep",
    "Wyvern's Rest",
    "Silent Hollow",
    "Thornwood",
    "Jade Citadel",
    "Ambergate",
    "Garnet Hold",
    "Quartz Ridge",
    "Beryl Shores",
    "Citrine Bay",
    "Diamond Vale",
    "Ruby Glen",
    "Sapphire Spire",
    "Emerald Crest",
    "Tanzanite Towers",
    "Peridot Path",
    "Aquamarine Altar",
    "Lapis Lagoon",
    "Amethyst Ascent",
    "Topaz Terrace",
    "Opal Oasis",
    "Spinel Summit",
    "Tourmaline Trail",
    "Agate Arch",
    "Malachite Meadow",
    "Serpentine Steps",
    "Jasper Junction",
    "Flint Fields",
    "Granite Glade",
    "Slate Slopes",
    "Marble Mound",
    "Chalk Cliffs",
    "Basalt Bastion",
    "Pumice Peak",
    "Sandstone Sanctuary",
    "Clay Commons",
     "Quicksilver Quarry",
    "Adamant Anvil",
    "Mithril Mines",
    "Aurum Alleys",
    "Electrum Emporium",
     "Bronze Bridge",
    "Copper Cove"
  ];

  useEffect(() => {
    const shuffleArray = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
  
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
            0.2 * containerWidth + Math.random() * (containerWidth * 0.6),
          Y_location:
            0.1 * containerHeight + Math.random() * (containerHeight * 0.7),
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
        console.warn("Container ref is not available.");
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight * 0.7;
  
      const shuffledCities = shuffleArray([...listOfCities]); // Shuffle city names
      const boards: Board[] = [];
      for (let i = 0; i < boardSize; i++) {
        if (i >= shuffledCities.length) {
          console.warn("Not enough unique cities to assign unique names to each board");
          break;
        }
        const position = generateNonOverlappingPosition(
          boards,
          containerWidth,
          containerHeight
        );
        boards.push({
          name: shuffledCities[i], // Assign city name from shuffled list
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
    return () => window.removeEventListener("resize", handleResize);
  }, [boardSize]);

  console.log(boards);

  if (username.trim() === '' ) {
    return <Login setUsername={setUsername} setBoardSize={setBoardSize} />;
  }

  return (
    <div className="bg-[#3000BE]">
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
                    <GameTab
                      onRoll={handleProgressUpdate}
                      allies={allies}
                      enemy={enemies}
                    />
                  </div>
                </div>
              }
            />
            <Route
              path="/novel"
              element={
                <Novel setStoryNow={setStoryNow} onAnswer={handleAnswer} />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/winner" element={<WinPage />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
