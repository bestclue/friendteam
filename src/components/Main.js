import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Diary from "@/components/Diary";
import ChatPage from "@/components/ChatPage";
import "../styles/globals.css";
import Calendartmp from "./Calendartmp";

const Main = () => {
  const router = useRouter();
  const [parsedData, setParsedData] = useState(null);
  const [showPoem, setShowPoem] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [monthdata, setMonthData] = useState([]);
  const [searchedDates, setSearchedDates] = useState([]); // searchedDates 상태 추가

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleParsed = (data) => {
    setParsedData(data);
  };

  const handleDiaryOpen = (day, data) => {
    setShowDiary(true);
    setDate(day);
    setData(data);
  };

  const handleDiaryClose = () => {
    setShowDiary(false);
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const resetSearch = () => {
    setSearchedDates([]); // resetSearch 함수 추가
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

  const handleMonthData = (data) => {
    setMonthData(data);
  };

  const handleSearchDates = (dates) => {
    setSearchedDates(dates);
    console.log("Searched Dates:", dates);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-purple-300 shadow-md p-4 fixed top-0 left-0 right-0 z-10 h-12">
          <div className="container mx-auto flex justify-between items-center">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => {
                handleDiaryClose();
                resetSearch(); // onClick 핸들러에 resetSearch 추가
              }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img src="/감성일기 곰돌이.png" alt="감성일기 곰돌이" width="30" height="30" style={{ marginRight: '10px' }} />
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
              monthData={showDiary ? null : monthdata}
              onSearchDates={handleSearchDates}
            />
          </div>
          <div className="md:w-3/4 w-full mr-6 mb-6 md:mb-0">
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
                  dates={searchedDates} // dates 속성 추가
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