"use client"

import React, { useState } from 'react';

const Emotion = ({onEmotion}) => {
  const [emotion, setEmotion] = useState('');
  const emotions = ['기쁨🥳','편안😌', '무난😐', '피곤🥱','슬픔🥺','분노😠'];

  const handleEmotionChange = (newEmotion) => {
    setEmotion(newEmotion);
    onEmotion(newEmotion); // Fixed: it should pass newEmotion instead of emotion
  };

  return (
    <div className="w-1/5 grid grid-cols-2 gap-4 p-4">
      {emotions.map((em, index) => (
        <button 
          key={index} 
          onClick={() => handleEmotionChange(em)}
          className={`h-fit bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded ${
            emotion !== em ? 'bg-purple-500/25' : ''
          }`}
        >
          {em}
        </button>
      ))}
    </div>
  );
};

export default Emotion;
