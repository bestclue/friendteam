import React from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Diary from "@/components/Diary";

import "../styles/globals.css";

const Main = ({ date }) => {
  const { data: session } = useSession();

  return (
    <div>
      <Diary user={session?.user} />
    </div>
  );
};

const MainWithSession = ({ date }) => {
  return (
    <SessionProvider>
      <Main date={date} />
    </SessionProvider>
  );
};

export default MainWithSession;