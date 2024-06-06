"use client";

import React, { useState, useEffect } from 'react';
import ChatPage from '@/components/ChatPage';
import ChatInput from '@/components/ChatInput';

import { db, storage } from "@/firebase";

import { collection, addDoc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import ImageUpload from '@/components/ImageUpload';
import Emotion from "@/components/Emotion";

const Diary = ({ onChat, user, ondiaryinput, name}) => {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // 사용자 상태 추가
  const [chatHistory, setChatHistory] = useState([]);



  const handleImageUpload = (url) => {
    if (!url) {
      alert('Please select an image before uploading.');
      return;
    }
    console.log('uploaded URL:', url); // URL 확인용 로그
    setUrl(url);
    console.log('handleImageUpload에서 setUrl 호출 후 URL:', url);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEmotion = (emotion) => {
    setEmotion(emotion);
    console.log(emotion);
  }
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const lastNewlineIndex = text.lastIndexOf('\n');
      const recentText = lastNewlineIndex !== -1 ? text.slice(lastNewlineIndex + 1) : text;
      ondiaryinput(recentText);
    }
  };

  const handleSaveEntry = async () => {
    // 유저 정보와 텍스트가 입력되었는지 확인
    if (!name) {
      alert('Please log in before saving.'); // 로그인이 되어 있지 않은 경우 알림을 표시하고 저장을 중단합니다.
      return;
    }
  
    // 이미지와 텍스트가 입력되었는지 확인
    if (!text) {
      alert('Please enter text before saving.');
      return;
    }
  
    console.log('저장할 텍스트:', text); 
    console.log('감정', emotion); // 텍스트 확인
    console.log('저장할 이미지 URL:', url);  // 이미지 URL 확인
  
    try {
      // 텍스트와 이미지 URL을 Firestore에 저장
      const docRef = await setDoc(doc(db, 'diaryEntries',`${name}_${new Date().toISOString()}`), {
        text: text,
        image: url,
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Entry saved successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  return (
<>
      <div className="h-full flex flex-col w-full bg-[#E4DAFF] p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Diary Entry</h2>
          <div className="w-full border flex felx-col">
          <ImageUpload ondownloadURL={handleImageUpload} name={name}/>
          <Emotion onEmotion={handleEmotion}/>
          </div>
        <textarea
          className="bg-white/0 w-full p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mt-4"
          rows="10"
          placeholder="Enter your thoughts here..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
        ></textarea>
        <button
          onClick={handleSaveEntry}
          className="mt-4 p-2 bg-[#653CD5] text-white rounded-lg"
        >
          Save Diary
        </button>
      </div>
    </>
  );
};

export default Diary;