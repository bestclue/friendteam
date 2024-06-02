"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("your_provider_name", { callbackUrl: "/" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex justify-center h-screen" style={{ background:'linear-gradient(to bottom, #A96BFB, #FFACDE)', fontFamily: 'Nanum Gothic'}}>
      <style>
        {`
          .custom-button {
            width: 10rem;
            justify-self: center;
            padding: 0.5rem;
            margin-bottom: 4px;
            background-color: #653CD5;
            color: #FFFFFF;
            border: 1px solid #653CD5;
            border-radius: 4px;
            font-size: 1.2rem;
          }
          .custom-button:hover {
            background-color: #FFFFFF;
            color: #653CD5;
          }
        `}
      </style>
      <div className="grid m-auto text-center">
        {session ? (
          <>
            <div className="m-4">Signed in as {session.user.name}</div>
            <button
              className="custom-button"
              onClick={() => router.push("/")}
            >
              Go to Home
            </button>
            <button
              className="custom-button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className="m-4" style={{ fontSize: '4rem', color: 'white'  }}>
              감.성.일.기.
              <img src="/감성일기 곰돌이.png" alt="감성일기 곰돌이" width="500" height="500"/>
            </div>
            <div>
              <button
                className="custom-button"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}