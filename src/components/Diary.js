import React, { useState, useEffect } from 'react';
import { db, storage } from "@/firebase";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";
import ImageUpload from '@/components/ImageUpload';
import Emotion from "@/components/Emotion";
import PoemDisplay from '@/components/PoemDisplay';
import VideoGenerator from '@/components/VideoGenerator';

const Diary = ({ onChat, user, onSave, ondiaryinput, name, date, data, onEmotionSelect }) => {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [entryId, setEntryId] = useState('');
  const [save, setSave] = useState(false);
  const [vsave, setvSave] = useState(false);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
      alert('이미지를 올려주세요!');
      return;
    }
    setUrl(url);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Count the number of non-consecutive periods
    const periods = newText.split('').reduce((acc, char, idx) => {
      if (char === '.' && newText[idx - 1] !== '.') {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (periods > sentenceCount) {
      setSentenceCount(periods);
      //문장 4개 쓰면 데이터 보내기
      if (periods % 4 === 0) {
        const processedText = newText;
        ondiaryinput(processedText);
        console.log("newText:", processedText);
      }
    }
  };

  const handleEmotion = (emotion) => {
    setEmotion(emotion);
    onEmotionSelect(emotion);
  };

  const handleSaveEntry = async () => {
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

      alert('멋진 일기가 작성되었어요! 시와 동영상을 만들어줄게요');
      setSave(true);
      setvSave(true);
      setLoading(true); // 로딩 시작
    } catch (error) {
      console.error('Error saving document: ', error);
      alert('오류가 발생했어요. 다시 시도해주세요!');
    }
  };

  const handleLoadingComplete = () => {
    setLoading(false); // 로딩 완료
  };

  return (
    <div className="h-full flex flex-col w-full bg-[#E4DAFF] p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 ml-4">{date}</h2>
      <hr className="w-full border-purple-300"/>
      <div className="flex w-full gap-4 h-full">
        <div className="flex flex-col w-[55%] gap-4 h-full">
          <div className="flex-grow flex items-center w-full">
              
              {!save || !videoUrl && <ImageUpload 
                ondownload={handleImageUpload} 
                name={name} 
                className="h-full" 
                date={date} 
                u={url} // Pass the image URL from state
              />}
              <VideoGenerator 
                url={url} // Pass the video URL from state
                entryId={entryId} 
                vd={videoUrl}
                vsave={vsave}
                onLoadingComplete={handleLoadingComplete}
              />
          </div>
          <div>
            <Emotion 
              emo={emotion} 
              onEmotion={handleEmotion}
            />
          </div>
            <div className="mt-8">
              <PoemDisplay 
                entryId={entryId} 
                po={data?.poem} // Pass the poem from data
                save={save}
                onLoadingComplete={handleLoadingComplete}
              />
              {/* Add the image here */}
            </div>
        </div>
        <textarea
          className="bg-white/0 w-[45%] p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-9/10 mt-9"
          rows="10"
          placeholder="오늘 하루를 정리해주세요!"
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="flex justify-end mt-4s">
        <button
          onClick={handleSaveEntry}
          className="mt-4 p-2 bg-[#653CD5] text-white rounded-lg text-sm"
        >
          Save Diary
        </button>
      </div>
    </div>
  );
};

export default Diary;