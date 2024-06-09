"use client";

import React, { useState, useEffect } from 'react';
import { db, storage } from "@/firebase";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";
import ImageUpload from '@/components/ImageUpload';
import Emotion from "@/components/Emotion";
import PoemDisplay from "@/components/PoemDisplay";
import VideoGenerator from './VideoGenerator';

const Diary = ({ onChat, user, onSave, ondiaryinput, name, date, data }) => {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [entryId, setEntryId] = useState('');
  const [save, setSave] = useState(false);

  useEffect(() => {
    if (data) {
      console.log("Setting state with data:", data);
      setUrl(data.image || '');
      setVideoUrl(data.video || '');
      setText(data.text || '');
      setEmotion(data.emotion || '');
      setEntryId(data.id || '');
    }
  }, [data]);

  const handleImageUpload = (url) => {
    if (!url) {
      alert('Please select an image before uploading.');
      return;
    }
    setUrl(url);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEmotion = (emotion) => {
    setEmotion(emotion);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const lastNewlineIndex = text.lastIndexOf('\n');
      const recentText = lastNewlineIndex !== -1 ? text.slice(lastNewlineIndex + 1) : text;
      ondiaryinput(recentText);
    }
  };

  const handleSaveEntry = async () => {
    setSave(true);
    if (!name) {
      alert('Please log in before saving.');
      return;
    }

    if (!text) {
      alert('Please enter text before saving.');
      return;
    }

    try {
      const diaryEntry = {
        name: name,
        date: date,
        text: text,
        image: url,
        emotion: emotion,
      };

      if (entryId) {
        const entryRef = doc(db, "diaryEntries", entryId);
        await updateDoc(entryRef, diaryEntry);
        console.log('Document updated with ID: ', entryId);
      } else {
        const docRef = await addDoc(collection(db, "diaryEntries"), diaryEntry);
        setEntryId(docRef.id);
        console.log('Document written with ID: ', docRef.id);
      }

      alert('Entry saved successfully!');
    } catch (error) {
      console.error('Error saving document: ', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col w-full bg-[#E4DAFF] p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{date}</h2>
      <div className="flex w-full gap-4 h-full">
        <div className="flex flex-col w-2/3 gap-4 h-full">
          <div className="flex-grow h-full">
            {!videoUrl ? (<ImageUpload 
              onDownloadURL={handleImageUpload} 
              name={name} 
              className="h-full" 
              date={date} 
              u={url} // Pass the image URL from state
            />) :(
            <VideoGenerator 
              url={videoUrl} // Pass the video URL from state
              entryId={entryId} 
              vd={videoUrl}
              save={save}
            />)}
          </div>
          <div>
            <Emotion 
              emo={emotion} 
              onEmotion={handleEmotion}
            />
          </div>
          <div className="flex-grow h-full bg-white/0 p-4 border rounded-lg shadow-inner mt-4">
            <PoemDisplay 
              entryId={entryId} 
              po={data?.poem} // Pass the poem from data
              save={save}
            />
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
  );
};

export default Diary;
