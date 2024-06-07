"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { ChatInput } from "@/components/ChatInput";
import { ChatLoader } from "@/components/ChatLoader";
import { ChatBubble } from "@/components/ChatBubble";

const ChatPage = ({ parsedData, onParsedData, name }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("기본");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    const chatresponse = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages.slice(1),
      }),
    });

    if (!chatresponse.ok) {
      setLoading(false);
      throw new Error(chatresponse.statusText);
    }

    const chatresult = await chatresponse.json();

    if (!chatresult) {
      return;
    }

    const emotionResponse = await fetch("/api/detect-emotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: updatedMessages.slice(1) }),
    });
  
    if (!emotionResponse.ok) {
      throw new Error(emotionResponse.statusText);
    }
  
    const emotionResult = await emotionResponse.json();
    console.log("emotionResult:", emotionResult);
    const emotion = emotionResult.emotion;
    console.log("Selected Emotion:", emotion);

    try {
      setLoading(false);
      setMessages((messages) => [...messages, chatresult]);
      setEmotion(emotion);
    } catch (error) {
      console.error("Error detecting emotion:", error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        parts: [{ text: `안녕하세요,${name}님!  오늘은 무슨 일이 있었나요?` }],
      },
    ]);
    setEmotion("기본");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleReset();
  }, []);

  useEffect( () => {
    if (parsedData) {
      handleSend({ role: "user", parts: [{ text: parsedData }] });
  }}, [parsedData]);

  return (
    <>
      <Head>
        <title>A Simple Chatbot</title>
        <meta name="description" content="A Simple Chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-full">
        {/* <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
          <div className="font-bold text-3xl flex text-center">
            <a
              className="ml-2 hover:opacity-50"
              href="https://code-scaffold.vercel.app"
            >
              감성일기
            </a>
          </div>
        </div> */}

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            {/* AI 메시지 출력 */}
            <div className="mb-4 overflow-y-auto" style={{ maxHeight: "200px" }}>
                {
                (messages
                  .filter((message) => message.role === "model")
                  .slice(-1)
                  .map((message, index) => (
                    <div key={index} className="my-1 sm:my-1.5">
                      <ChatBubble message={message} />
                    </div>
                  )))
                }
            </div>

             {/* 이미지 출력 */}
             <div className="mb-4">
             <img
                src={`감성일기 곰돌이 ${emotion}.png`}
                alt={`감성일기 곰돌이 ${emotion}`}
                width="700"
                height="600"
                style={{ marginTop: "150px" }}
              />
            </div>

            {/* 사용자 메시지 출력
            <div className="mb-4 overflow-y-auto" style={{ maxHeight: "200px" }}>
              {messages
                .filter((message) => message.role === "user")
                .map((message, index) => (
                  <div key={index} className="my-1 sm:my-1.5 text-right">
                    <ChatBubble message={message} />
                  </div>
                ))}
            </div> */}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-neutral-300 py-2 px-8">
          <ChatInput onSendMessage={handleSend} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;