"use client";

import React, { useState, useEffect } from 'react';
import Chat from '@/components/Chat';


import { db, storage } from "@/firebase";

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Diary = ({ onChat,user }) => {
    const [url, setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [text, setText] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // 사용자 상태 추가

    const router = useRouter();
    const { data } = useSession({
      required: true,
      onUnauthenticated() {
        router.replace("/login");
      },
    });

    useEffect(() => {
        console.log("data", data);
       
    }, []);

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
          // 유저 정보와 텍스트가 입력되었는지 확인
          if (data?.usef?.name) return;
    
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
                userName: data?.user?.name,
                text: text,
                url: url,
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Entry saved successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to save entry. Please try again.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row p-6 bg-gradient-to-b from-purple-400 to-pink-400 min-h-screen">
            <div className="md:w-1/4 w-full mb-6 md:mb-0 md:mr-6 ">
                <Chat className="border rounded-lg shadow-md bg-white p-4"/>
            </div>
            <div className="flex flex-col w-full bg-[#E4DAFF] p-6 border rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Diary Entry</h2>
                <div className="border-dashed border-2 border-purple-500 p-6 h-1/3 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                    이미지 업로드
                </div>
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
                    className="mt-4 p-2 bg-[#653CD5] text-white rounded-lg"
                >
                    Save Entry
                </button>
            </div>
        </div>
    );
};

export default Diary;