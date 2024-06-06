import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Diary from "@/components/Diary";
import ChatPage from '@/components/ChatPage';
import "../styles/globals.css";

const Main = () => {
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const [parsedData, setParsedData] = useState(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
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
  }

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
      <Diary
        name={session?.user?.name}
        user={session?.user}
        ondiaryinput={handleParsed}
      />
    </div>
  );
};

export default Main;
