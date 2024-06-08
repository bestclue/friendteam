"use client";

import React, { useState, useEffect } from 'react';
import ChatPage from '@/components/ChatPage';
import ChatInput from '@/components/ChatInput';

import { db, storage } from "@/firebase";

import { doc, collection, addDoc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import ImageUpload from '@/components/ImageUpload';
import Emotion from "@/components/Emotion";
import PoemDisplay from "@/components/PoemDisplay";
import VideoGenerator from './VideoGenerator';

const Diary = ({ onChat, user, onSave, ondiaryinput, name}) => {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // 사용자 상태 추가
  const [chatHistory, setChatHistory] = useState([]);
  const [entryId, setEntryId] = useState('');

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
      // 현재 시간을 얻어와서 entryId로 사용
      const currentTime = new Date();
      const koreanTime = currentTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
      const newEntryId = `${name}_${koreanTime}`;

      // 텍스트와 이미지 URL을 Firestore에 저장
      const docRef = await setDoc(doc(db, 'diaryEntries', newEntryId), {
        text: text,
        image: url,
        emotion: emotion,
      });
      // 새로운 문서를 추가한 경우에만 문서 ID를 출력
      if (docRef) {
        console.log('Document written with ID: ', docRef.id);
      }
      console.log('Entry saved successfully!');
      alert('Entry saved successfully!');
      setEntryId(newEntryId);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  return (
    <>
      <div className="h-full flex flex-col w-full bg-[#E4DAFF] p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Diary Entry</h2>
        <div className="flex w-full gap-0 h-full">
          <div className="flex flex-col w-2/3 gap-4 h-full">
            <div className="flex-grow h-full">
              <ImageUpload ondownloadURL={handleImageUpload} name={name} className="h-full" />
            </div>
            <div>
              <Emotion onEmotion={handleEmotion} />
            </div>
            <div className="flex-grow h-full bg-white/0 p-4 border rounded-lg shadow-inner mt-4">
              <PoemDisplay entryId={entryId}/>
            </div>
          </div>
          <textarea
            className="bg-white/0 w-1/3 p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-full"
            rows="10"
            placeholder="Enter your thoughts here..."
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveEntry}
            className="p-2 bg-[#653CD5] text-white rounded-lg text-sm"
          >
            Save Diary
          </button>
        </div>
      </div>
    </>
  );  
};

export default Diary;