"use client";

import React, { useState } from 'react';
import Chat from '@/components/Chat';
import ImageUpload from '@/components/ImageUpload';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';

const Diary = ({ onChat }) => {
    const [url, setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [text, setText] = useState('');

    const handleImageUpload = async (url) => {
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

    const handleSaveEntry = async () => {
        // 이미지와 텍스트가 입력되었는지 확인
        if (!text) {
            alert('Please enter text before saving.');
            return;
        }

        console.log('저장할 텍스트:', text);  // 텍스트 확인
        console.log('저장할 이미지 URL:', url);  // 이미지 URL 확인

        try {
            // 텍스트와 이미지 URL을 Firestore에 저장
            const docRef = await addDoc(collection(db, 'diaryEntries'), {
                text: text,
                url: url
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Entry saved successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to save entry. Please try again.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row p-6 bg-gray-100 min-h-screen">
            <div className="md:w-1/4 w-full mb-6 md:mb-0 md:mr-6">
                <Chat className="border rounded-lg shadow-md bg-white p-4"/>
            </div>
            <div className="flex flex-col w-full bg-white p-6 border rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Diary Entry</h2>
                <ImageUpload setUrl={(url) => {
  console.log('Received URL:', url); // 확인용 로그
  handleImageUpload(url);
}} />
                <textarea 
                    className="w-full p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mt-4"
                    rows="10"
                    placeholder="Enter your thoughts here..."
                    value={text}
                    onChange={handleTextChange}
                ></textarea>
                <button 
                    onClick={handleSaveEntry} 
                    className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
                >
                    Save Entry
                </button>
            </div>
        </div>
    );
};

export default Diary;