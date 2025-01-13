import React, { useState, useEffect } from 'react';

const Novel: React.FC = () => {
    const story = [
        "Once upon a time, in a faraway land, there was a brave knight.",
        "The knight embarked on a quest to save the kingdom from a terrible dragon.",
        "After many trials and tribulations, the knight finally reached the dragon's lair.",
        "With courage and strength, the knight defeated the dragon and saved the kingdom.",
        "The kingdom rejoiced and the knight was hailed as a hero."
    ];

    const [currentLine, setCurrentLine] = useState(0);
    const [question, setQuestion] = useState(false);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            if (currentLine < story.length - 1) {
                setCurrentLine(currentLine + 1);
            } else {
                setQuestion(true);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentLine]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {!question ? (
                <div>
                    <p>{story[currentLine]}</p>
                    <p>(Press Space to continue...)</p>
                </div>
            ) : (
                <div>
                    <p>The story has ended. What did you think of the story?</p>
                    <input type="text" placeholder="Your thoughts..." />
                </div>
            )}
        </div>
    );
};

export default Novel;