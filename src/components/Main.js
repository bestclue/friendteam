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
    console.log(data);
  };

  const handleSearchDates = (dates) => {
    setSearchedDates(dates);
    console.log("Searched Dates:", dates);
  };

  if (status === "loading") {
    return <div className="flex flex-col justify-center items-center text-center space-y-10 bg-purple-300 min-h-screen">
    <div className="font-semibold text-xl">
      로딩 중입니다.
      <br />
      <img src="/감성일기 곰돌이.png" alt="감성일기 곰돌이" width="500" height="500"/>
      <br />
      잠시 기다려주세요.
    </div>
</div>;
  } else {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-purple-300 shadow top-0 left-0 right-0 h-14">
          <div className="px-16 container mx-auto flex justify-between ">
          <div className="flex grid-col">
          <img src="/감성일기 곰돌이.png" alt="감성일기 곰돌이" width="60" height="60" style={{ marginRight: '10px' }} />
          <h1
            className="text-2xl font-bold cursor-pointer pt-2.5"
            onClick={() => {
              handleDiaryClose();
              resetSearch(); // onClick 핸들러에 resetSearch 추가
              window.location.reload();
            }}
            // style={{ display: 'flex', alignItems: 'center' }}
          >
          감.성.일.기.
          </h1>
          </div>

            <button onClick={handleSignOut} className="text-red-500 font-semibold text-lg ">로그아웃</button>
          </div>
        </header>

        <div className="h-screen p-6 bg-gradient-to-b from-purple-400 to-pink-400 flex justify-center px-4 items-stretch">
          <div className="w-2/12 mr-6">
            <ChatPage
              name={session?.user?.name}
              className="border rounded-lg shadow-md bg-white p-4"
              parsedData={parsedData}
              selectedEmotion={selectedEmotion}
              monthData={monthdata}
              onSearchDates={handleSearchDates}
            />
          </div>
          <div className="h-full w-[50%] py-4 ml-12 grid justify-stretch">
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
              <div
              >
                <Calendartmp
                  onDiaryOpen={handleDiaryOpen}
                  name={session?.user?.name}
                  onMonthData={handleMonthData}
                  dates={searchedDates} // dates 속성 추가
                />
              </div>
            )}
          </div>
          </div>
        </div>
    );
  }
};

export default Main;
