// 다이어리 제작페이지
"use client"

import React, { useState } from 'react';
import Chat from '@/components/Chat';
import { db, storage } from "@/firebase";

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import ImageUpload from './ImageUpload';

const Diary = ({ onChat }) => {
    return (
        <div className="flex flex-col md:flex-row p-6 bg-gray-100 min-h-screen">
            <div className="md:w-1/4 w-full mb-6 md:mb-0 md:mr-6">
                <Chat className="border rounded-lg shadow-md bg-white p-4"/>
            </div>
            <div className="flex flex-col w-full bg-white p-6 border rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">이미지 입력</h2>
                <div className="border-dashed border-2 border-gray-300 p-6 h-1/3 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                    이미지 업로드
                </div>
                <ImageUpload/>
                <textarea 
                    className="w-full p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="10"
                    placeholder="여기에 텍스트를 입력하세요..."
                ></textarea>
            </div>
        </div>
    );
};

export default Diary;
