import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Calendar from '@/components/Calendartmp';
import ChatPage from '@/components/ChatPage';
import Diary from '@/components/Diary';
import "../styles/globals.css";

const Main = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (router) {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 라우터 사용
    if (!router) return;
  }, [router]);

  const handleDateClick = (day) => {
    // 달력에서 날짜를 클릭할 때 다이어리 페이지로 이동
    router.push({
      pathname: '/diary',
      query: { selectedDate: day }, // 선택한 날짜를 쿼리 파라미터로 전달
    });
  };

  return (
    <div className="main-container flex flex-row">
      <div className="chat-container w-1/3 p-4">
        <ChatPage user={session?.user} />
      </div>
      <div className="calendar-container w-2/3 p-4" >
        {/* Calendar에 handleDateClick 함수 전달 */}
        <Calendar user={session?.user} onDateClick={handleDateClick} />
      </div>
    </div>
  );
};

export default Main;