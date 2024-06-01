import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useRouter } from "next/navigation"; // useRouter를 가져옵니다.
import ChatPage from '@/components/ChatPage'; // ChatPage 컴포넌트를 가져옵니다.

const CalendarMain = () => {
  const [parsedData, setParsedData] = useState(null);
  const router = typeof window !== 'undefined' ? useRouter() : null; // 클라이언트 측에서만 라우터를 가져옵니다.

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    
    // 달력을 클릭했을 때 components/Main.js로 이동합니다.
    if (router) {
      router.push(`/Main?date=${formattedDate}`);
    }
  };

  return (
    <div style={{ display: "flex" }}>
    <div style={{ flex: "0.8", marginRight: "10px"  }}>
      <ChatPage />
    </div>
    <div style={{ flex: "2", width: "300px", height: "400px"}}>
      <Calendar onClickDay={handleDateClick} />
    </div>
  </div>
  );
};

export default CalendarMain;