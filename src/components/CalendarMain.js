import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import ChatPage from '@/components/ChatPage';

import "../styles/globals.css";
const CalendarMain = () => {
  const [parsedData, setParsedData] = useState(null);
  const { data: session, status } = useSession();
  const router = typeof window !== 'undefined' ? useRouter() : null;

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    
    if (router) {
      router.push(`/Main?date=${formattedDate}`);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    // 사용자가 인증되지 않았을 때 로그인 페이지로 리디렉션
    if (router) {
      router.push("/login");
    }
    return null;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0.8", marginRight: "10px" }}>
        <ChatPage />
      </div>
      <div style={{ flex: "2", width: "300px", height: "400px"}}>
        <Calendar onClickDay={handleDateClick} />
      </div>
    </div>
  );
};

export default CalendarMain;