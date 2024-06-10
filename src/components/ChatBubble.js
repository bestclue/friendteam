export const ChatBubble = ({ message }) => {
    return (
      <div className={`h-auto flex justify-${message.role === "model" ? "start" : "end"} mb-2`}>
        <div
          className={` ${
            message.role === "model" ? "items-start" : "items-end"
          }`}
        >
          <div
            className={`flex items-center ${
              message.role === "model"
                ? "bg-neutral-200 text-neutral-900 justify-start"
                : "bg-blue-500 text-white justify-end"
            } rounded-2xl px-3 py-2 max-w-full whitespace-pre-wrap`}
            style={{ overflowWrap: "anywhere" }}
          >
            {message.parts[0].text}
          </div>
        </div>
      </div>
    );
  };