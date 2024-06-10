import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const PoemDisplay = ({ entryId, po, save, onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [poem, setPoem] = useState(po);

  const savePoem = async (entryId, formattedPoem) => {
    try {
      const entryRef = doc(db, 'diaryEntries', entryId);
      await updateDoc(entryRef, {
        poem: formattedPoem
      });
      console.log('Poem saved to Firestore');
    } catch (error) {
      console.error('Error saving poem to Firestore:', error);
    }
  };  

  const fetchData = async () => {
    console.log('fetchData 함수 호출');
    setLoading(true);

    try {
      const entryRef = doc(db, "diaryEntries", entryId);
      const entryDoc = await getDoc(entryRef);

      if (!entryDoc.exists()) {
        throw new Error("Entry not found");
      }

      const entryData = entryDoc.data();
      const text = entryData.text;

      console.log('텍스트 데이터:', text);

      const response = await fetch("/api/generate-poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      console.log('result:', result);

      if (!result) {
        return;
      }

      const poemText = result.parts[0]?.text;
      const formattedPoem = poemText.replace(/\n/g, '<br>');

      console.log('생성된 시:', poemText);
      savePoem(entryId, formattedPoem);
      setPoem(formattedPoem);
    } catch (error) {
      console.error("Error fetching or processing data: ", error);
    } finally {
      setLoading(false);
      onLoadingComplete(); // 로딩 완료
    }
  };

  useEffect(() => {
    console.log('useEffect 호출');
    setPoem(po);
  }, [po]);

  useEffect(() => {
    if(save){
      fetchData();
    }
  }, [save]);

  return (
    <div className="h-full flex flex-col w-full bg-purple-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">오늘의 시</h2>
      {loading && save ? (
        <div className="loading-container">
          <img
            id="poem-image"
            src="감성일기 곰돌이 시 생성.png"
            alt="Generating Poem..."
            className='h-24 w-20'
          />
        </div>
      ) : (
        <div className="overflow-auto bg-white/0 w-full h-24 p-4 mt-4"
          dangerouslySetInnerHTML={{ __html: poem }}>
        </div> 
      )}
    </div>
  );
};

export default PoemDisplay;