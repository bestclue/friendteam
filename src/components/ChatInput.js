import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

export const ChatInput = ({ onSendMessage }) => {
  const [content, setContent] = useState("");

  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSend = () => {
    if (!content) {
      alert("메시지를 입력하세요.");
      return;
    }

    onSendMessage({ role: "user", parts: [{ text: content }] });
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
        style={{ resize: "none" }}
        placeholder="메시지를 입력해주세요"
        value={content}
        rows={2}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>
        <IconArrowUp className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-purple-700 text-white hover:opacity-80" />
      </button>
    </div>
  );
};