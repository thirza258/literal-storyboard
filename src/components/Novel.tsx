import React, { useState, useEffect } from 'react';
import imageHarbour from '../assets/image_harbour.png';
import imageHome from '../assets/image_home.png';
import imageCityStreet from '../assets/image_city_street.png';
import imageHall from '../assets/image_hall.png';
import imageDining from '../assets/image_dining.png';
import { run } from '../ai_handler/ai';
import { useNavigate } from 'react-router-dom';

interface StoryData {
  story: string;
  question: string;
  listOfAnswer: string[];
}

const Novel: React.FC = () => {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [step, setStep] = useState<'story' | 'question' | 'answer'>('story');
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storyLines, setStoryLines] = useState<string[]>([]);

  const navigate = useNavigate();

  const listOfImages = [imageHarbour, imageHome, imageCityStreet, imageHall, imageDining];

  const handleInput = (event: KeyboardEvent | MouseEvent) => {
    console.log('Current Step:', step); 
    if (step === 'story') {
      if (currentLine < storyLines.length - 1) {
        setCurrentLine(currentLine + 1); // Advance story line
        randomizeBackground(); // Update background image
      } else {
        setStep('question');
      }
    } else if (step === 'question') {
      setStep('answer');
    } else if (step === 'answer') {
      setCurrentLine(0);
    }
  };
  

  const randomizeBackground = () => {
    const randomIndex = Math.floor(Math.random() * listOfImages.length);
    setCurrentImage(randomIndex);
  };

  const handleAnswerClick = (answer: string) => {
    console.log(`Answer chosen: ${answer}`);
    navigate('/')
    
  };

  const preloadImages = () => {
    listOfImages.forEach((src) => {
      const img = new Image();

      img.onload = () => {
        setImagesLoaded((prev) => {
          const newCount = prev + 1;
          if (newCount === listOfImages.length) {
            randomizeBackground();
          }
          return newCount;
        });
      };

      img.onerror = () => {
        setError('Failed to load some images');
        setIsLoading(false);
      };

      img.src = src;
    });
  };

  // Validate story data structure
  const validateStoryData = (data: any): data is StoryData => {
    return (
      data &&
      typeof data.story === 'string' &&
      typeof data.question === 'string' &&
      Array.isArray(data.listOfAnswer) &&
      data.listOfAnswer.every((item: any) => typeof item === 'string')
    );
  };

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const response = await run({ input: "Assume you are a villager" });
        const responseText = await response.response.text();
        let parsedData: any;

        try {
          parsedData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Failed to parse JSON response');
        }

        if (!validateStoryData(parsedData)) {
          throw new Error('Invalid story data structure');
        }

        // Set the story data and split into lines
        setStoryData(parsedData);

        const lines = parsedData.story
          .split('\n')
          .filter((line: string) => line.trim());

        if (lines.length === 0) {
          throw new Error('Story content is empty');
        }

        setStoryLines(lines); // Update story lines

        preloadImages();
      } catch (err) {
        console.error('Error fetching story:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch story data');
        setIsLoading(false);
      }
    };

    fetchStoryData();
  }, []);

  useEffect(() => {
    if (storyData && imagesLoaded === listOfImages.length) {
      window.addEventListener('keydown', handleInput);
      window.addEventListener('click', handleInput);
      setIsLoading(false);
    }
    console.log("step", step);
    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('click', handleInput);
    };

    
  }, [storyData, imagesLoaded]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="mb-4">Loading Novel...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${(storyData ? 50 : 0) + (imagesLoaded / listOfImages.length) * 50}%`,
            }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {storyData ? 'Loading images...' : 'Loading story...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!storyData || storyLines.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-yellow-500">No story content available</div>
      </div>
    );
  }

  return (
    <div
      className="ml-40 h-[80vh] bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${listOfImages[currentImage]})` }}
    >
      <div className="text-white p-4 bg-black bg-opacity-50">
        {step === 'story' ? (
          <div>
            <p>{storyLines[currentLine]}</p>
            <button
              className="mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-400 transition-colors"
              onClick={() => {
                if (currentLine < storyLines.length - 1) {
                  setCurrentLine(currentLine + 1); // Advance story line
                  randomizeBackground(); // Update background image
                } else {
                  setStep('question'); // Transition to question phase
                }
              }}
            >
              Next
            </button>
          </div>
        ) : step === 'question' ? (
          <div>
            <p>{storyData.question}</p>
            {storyData.listOfAnswer.map((answer: string, index: number) => (
              <button
                key={index}
                className="block mt-2 text-blue-500 hover:text-blue-400 transition-colors"
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </button>
            ))}
            <button
              className="mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-400 transition-colors"
              onClick={() => setStep('answer')} // Transition to answer phase
            >
              Next
            </button>
          </div>
        ) : (
          <div>
            <p>Choose your answer!</p>
            <button
              className="mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-400 transition-colors"
              onClick={() => {
                setStep('story'); // Reset back to story
                setCurrentLine(0); // Optionally restart the story
              }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Novel;
