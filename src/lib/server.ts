import axios from "axios";
import { TextPromptBody } from "./supabase";

const server = axios.create({
  baseURL: "http://localhost:8080",
});

export const sendTextPrompt = async (
  body: TextPromptBody,
  onStream?: (chunk: string) => void,
) => {
  if (onStream) {
    // Use fetch for streaming
    const response = await fetch("http://localhost:8080/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    let accumulatedContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the Uint8Array to text
        const text = new TextDecoder().decode(value);
        accumulatedContent += text;
        onStream(text);
      }

      // Return the accumulated content in the same format as axios response
      return { data: { response: accumulatedContent } };
    } finally {
      reader.releaseLock();
    }
  } else {
    // Use axios for non-streaming requests
    return server.post("/text", body);
  }
};

export const sendAudio = (body: FormData) => server.post("/audio", body);

export const sendToCorrection = (transcript: string) =>
  server.post("/correction", { transcript });

export const getTitle = (
  transcript: string,
  notes: string,
  title: string,
  description: string,
) => server.post("/title", { transcript, notes, title, description });

export default server;
