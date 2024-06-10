"use client"

import React, { useState, useEffect } from 'react';

const Emotion = ({ onEmotion, emo }) => {
  const [emotion, setEmotion] = useState(emo);
  const emotions = ['기쁨🥳', '편안😌', '무난😐', '피곤🥱', '슬픔🥺', '분노😠'];

  useEffect(() => {
    setEmotion(emo);
    console.log("dlah",emo);
  }, [emo]);

  const handleEmotionChange = (newEmotion) => {
    setEmotion(newEmotion);
    onEmotion(newEmotion);
  };

  return (
    <div className="w-full flex justify-center items-center gap-4 p-4">
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
