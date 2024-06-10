import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const PoemDisplay = ({ entryId, po, save }) => {
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

  useEffect(() => {
    if (!loading && !save) {
      const imageElement = document.getElementById('poem-image');
      if (imageElement) {
        imageElement.remove();
      }
    }
  }, [loading, save]);

  return (
    <div className="h-full flex flex-col w-full bg-purple-100 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Poem</h2>
      {loading && save &&  <img
    id="poem-image"
    src="감성일기 곰돌이 시 생성.png"
    alt="Generating Poem..."
    style={{
      display: 'block', // 이미지를 블록 레벨 요소로 설정하여 가운데 정렬을 적용합니다.
      margin: 'auto',   // 가운데 정렬을 위해 margin을 auto로 설정합니다.
      width: '30%',     // 이미지의 너비를 50%로 설정합니다. 필요에 따라 조절할 수 있습니다.
    }}
  />}
      <div className="bg-white/0 w-full p-4 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mt-4"
      dangerouslySetInnerHTML={{ __html: poem }}>
      </div>
    </div>
  );
};

export default PoemDisplay;