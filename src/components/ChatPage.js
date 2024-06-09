"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { ChatInput } from "@/components/ChatInput";
import { ChatLoader } from "@/components/ChatLoader";
import { ChatBubble } from "@/components/ChatBubble";

const ChatPage = ({ parsedData, onParsedData, name, selectedEmotion, monthData, onSearchDates }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("기본");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

// 사용자가 입력한 텍스트에서 대괄호로 둘러싼 텍스트를 추출하여 반환합니다.
const extractTextInBrackets = (text) => {
  const regex = /\[(.*?)\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

// 일기 데이터에서 대괄호로 둘러싼 텍스트와 일치하는 날짜를 찾아 반환합니다.
const findDatesFromText = (text) => {
  const searchKeywords = extractTextInBrackets(text);
  const foundDates = [];
  for (const keyword of searchKeywords) {
    for (const entry of monthData) {
      if (entry.text.includes(keyword)) {
        foundDates.push(entry.date);
      }
    }
  }
  return foundDates.length > 0 ? foundDates : null;
};

const handleSend = async (message) => {
  const updatedMessages = [...messages, message];
  setMessages(updatedMessages);
  setLoading(true);

  const messageText = message.parts[0].text;

  // 검색 대상 텍스트를 추출합니다.
  const searchKeywords = extractTextInBrackets(messageText);

  // 검색 대상 텍스트가 있는지 여부를 확인합니다.
  if (searchKeywords.length > 0) {
    // 검색 대상 텍스트가 있는 경우에는 검색을 수행합니다.
    const foundDates = findDatesFromText(messageText);
    // 찾은 모든 날짜를 부모 컴포넌트로 전달합니다.
    onSearchDates(foundDates);
    if (foundDates) {
      // 찾은 모든 날짜를 AI 메시지로 렌더링합니다.
      const dateMessages = foundDates.map(date => ({ role: "model", parts: [{ text: `사용자가 '${messageText}'를 썼던 날짜는 ${foundDates} 입니다.` }] }));
      setMessages(messages => [...messages, ...dateMessages]);
    } else {
      // 날짜를 찾지 못한 경우 메시지를 렌더링합니다.
      setMessages(messages => [...messages, { role: "model", parts: [{ text: `'${messageText}'에 해당하는 일기를 찾을 수 없습니다.` }] }]);
    }
  } else {
    // 검색 대상 텍스트가 없는 경우에는 AI 호출을 수행합니다.
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

    // 감정 키워드를 정의합니다
    const emotionKeywords = ["행복", "기뻐", "즐거", "웃", "신나", "기쁨", "좋",
      "슬픔", "우울", "눈물", "서러", "미안", "고독", "외로", "짜증", "화", "화남", "분노",
      "걱정", "긴장", "스트레스", "불안", "불안함", "불안감", "피곤",
      "평온", "안정", "안락", "편안", "고요", "평화", "차분"];
  
    // 감정 키워드를 검사하고 감정 인식 요청을 보냅니다
    const containsEmotionKeyword = emotionKeywords.some(keyword => messageText.includes(keyword));
    if (containsEmotionKeyword) {
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
    } else {
      // 감정 키워드가 없는 경우에도 처리합니다
      setLoading(false);
      setMessages((messages) => [...messages, chatresult]);
    }
  }
};

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        parts: [{ text: `안녕하세요, ${name}님!  오늘은 무슨 일이 있었나요? 찾고 싶으신 일기가 있으시면 대괄호 안에 이렇게 [해당 일기 텍스트]를 입력해주세요.` }],
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

  const removeEmoji = (str) => {
    return str.replace(/[\uD800-\uDFFF]./g, '');
  };

  const handleEmotionSelect = (selectedEmotion) => {
    const plainEmotion = removeEmoji(selectedEmotion);
    setEmotion(plainEmotion);
  };

  useEffect(() => {
    if (selectedEmotion) {
    handleEmotionSelect(selectedEmotion);
  }}, [selectedEmotion]);

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