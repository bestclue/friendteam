import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Diary from "@/components/Diary";
import ChatPage from '@/components/ChatPage';
import PoemDisplay from "@/components/PoemDisplay";
import "../styles/globals.css";

const Main = () => {
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const [parsedData, setParsedData] = useState(null);
  const [showPoem, setShowPoem] = useState(false); // showPoem 상태 추가
  const [entryId, setEntryId] = useState(''); // entryId 상태 추가

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleShowPoem = (entryId) => {
    setShowPoem(true); // showPoem 상태를 true로 업데이트하여 PoemDisplay를 보이도록 설정
    setEntryId(entryId); // entryId 상태를 업데이트
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

  const handleParsed = (data) => {
    setParsedData(data);
  }

  useEffect(() => {
    // 클라이언트 사이드에서만 라우터 사용
    if (!router) return;
  }, [router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }else {
  return (
    <div className="flex flex-col md:flex-row p-6 bg-gradient-to-b from-purple-400 to-pink-400 h-screen">
      <button onClick={handleSignOut}> signout</button>
      <div className="md:w-1/4 w-full mb-6 md:mb-0 md:mr-6">
        <ChatPage
          name={session?.user?.name}
          className="border rounded-lg shadow-md bg-white p-4"
          parsedData={parsedData}
        />
      </div>
      {/* 조건부 렌더링으로 showPoem 상태가 true일 때 PoemDisplay를 보여줌 */}
      {showPoem ? (
          <PoemDisplay entryId={entryId} />
        ) : (
          <Diary
            name={session?.user?.name}
            user={session?.user}
            ondiaryinput={handleParsed}
            onSave={handleShowPoem} // 일기 저장 시 handleShowPoem 함수 호출
          />
        )}
    </div>
  );
};
}
export default Main;
