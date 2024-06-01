"use client";

import { SessionProvider } from "next-auth/react";
import CalendarMain from "@/components/CalendarMain";

export default function Home() {
  return (
    <SessionProvider> 
      <div>
        <CalendarMain />
      </div>
    </SessionProvider>
  );
}