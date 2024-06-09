import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Diary from "@/components/Diary";
import ChatPage from "@/components/ChatPage";
import PoemDisplay from "@/components/PoemDisplay";
import "../styles/globals.css";
import Calendartmp from "./Calendartmp";
import Emotion from "@/components/Emotion";

const Main = () => {
  const router = useRouter();
  const [parsedData, setParsedData] = useState(null);
  const [showPoem, setShowPoem] = useState(false);
  const [showDiary, setShowDiary] = useState(false); // 다이어리 표시 여부 상태 추가
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [monthdata, setMonthData] = useState([]);
  const [searchedDates, setSearchedDates] = useState([]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleParsed = (data) => {
    setParsedData(data);
  };

  const handleDiaryOpen = (day, data) => {
    setShowDiary(true); // 다이어리 표시 상태를 true로 업데이트하여 다이어리를 보이도록 설정
    setDate(day);
    setData(data);
  };

  const handleDiaryClose = () => {
    setShowDiary(false); // 다이어리 닫기 버튼 클릭 시 다이어리 표시 상태를 false로 업데이트
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };  

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (router) {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    console.log("session data", session);
  }, [session]);

  useEffect(() => {
    if (!router) return;
  }, [router]);

  // Calendartmp 컴포넌트에서 monthdata를 전달받는 함수
  const handleMonthData = (data) => {
    setMonthData(data);
  };

  const handleSearchDates = (dates) => {
    setSearchedDates(dates);
    console.log("Searched Dates:", dates); // dates를 콘솔에 출력
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-purple-300 shadow-md p-4 fixed top-0 left-0 right-0 z-10 h-12">
          <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold cursor-pointer" onClick={handleDiaryClose} style={{ display: 'flex', alignItems: 'center' }}>
  <img src="/감성일기 곰돌이.png" alt="감성일기 곰돌이" width="30" height="30" style={{ marginRight: '10px' }}/>
  감성일기
</h1>
            <button onClick={handleSignOut} className="text-red-500">로그아웃</button>
          </div>
        </header>
        <div className="flex flex-col md:flex-row p-6 bg-gradient-to-b from-purple-400 to-pink-400 flex-grow">
          <div className="md:w-1/4 w-full mb-6 md:mb-0 md:mr-6">
            <ChatPage
              name={session?.user?.name}
              className="border rounded-lg shadow-md bg-white p-4"
              parsedData={parsedData}
              selectedEmotion={selectedEmotion}
              monthData={showDiary ? null : monthdata} // showDiary 상태에 따라 monthData 전달 여부 결정
              onSearchDates={handleSearchDates}
            />
          </div>
          <div className="md:w-3/4 w-full mr-6 mb-6 md:mb-0">
            {/* 조건부 렌더링으로 showPoem 상태가 true일 때 PoemDisplay를 보여줌 */}
            {/* {showPoem ? (
              <PoemDisplay entryId={entryId} />
            ) : (
              <Diary
                name={session?.user?.name}
                user={session?.user}
                ondiaryinput={handleParsed}
                onSave={handleShowPoem}
              />
            )} */}
            {/* Calendar 컴포넌트 추가 및 다이어리 표시 여부에 따른 조건부 렌더링 */}
            {showDiary ? (
              <Diary
                name={session?.user?.name}
                user={session?.user}
                ondiaryinput={handleParsed}
                onClose={handleDiaryClose}
                date={date}
                data={data}
                onEmotionSelect={handleEmotionSelect}
              />
            ) : (
              <>
                <Calendartmp
                  onDiaryOpen={handleDiaryOpen}
                  name={session?.user?.name}
                  onMonthData={handleMonthData}
                  dates={searchedDates}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Main;