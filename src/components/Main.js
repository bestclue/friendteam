import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Diary from "@/components/Diary";
import ChatPage from '@/components/ChatPage';

import "../styles/globals.css";

const Main = () => {
  const router = typeof window !== 'undefined' ? useRouter() : null;

 


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

  return <Diary user={session?.user} />;
};

const MainWithSession = ({ date }) => {
  return (
    <SessionProvider>
      <Main/>
    </SessionProvider>
  );
};

export default Main;

