"use client";

import React, { useState, useEffect } from 'react';

const Emotion = ({ onEmotion, emo }) => {
  const [emotion, setEmotion] = useState(emo);
  const emotions = ['기쁨🥳', '편안😌', '무난😐', '피곤🥱', '슬픔🥺', '분노😠'];

  useEffect(() => {
    setEmotion(emo);
    console.log("Current emotion:", emo);
  }, [emo]);

  const handleEmotionChange = (newEmotion) => {
    if (emotion === newEmotion) {
      setEmotion(null);
      onEmotion(null);
    } else {
      setEmotion(newEmotion);
      onEmotion(newEmotion);
    }
  };

  return (
    <div className="flex justify-between gap-4 w-full">
      {emotions.map((em, index) => (
        <button
          key={index}
          onClick={() => handleEmotionChange(em)}
          className={`h-fit bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded ${
            emotion !== em ? 'bg-purple-500/25' : 'bg-purple-700'
          }`}
        >
          {em}
        </button>
      ))}
    </div>
  );
};

export default Emotion;
