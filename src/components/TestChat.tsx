import React, { useEffect } from "react";

import { useChat } from "ai/react";

export default function TestChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:8080",
    streamProtocol: "text",
  });

  useEffect(() => {
    fetch("http://localhost:8080").then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
