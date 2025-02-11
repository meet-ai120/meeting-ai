import axios from "axios";
import { supabase, TextPromptBody } from "./supabase";

const SERVER_URL = "http://161.35.197.89:8080";

const server = axios.create({
  baseURL: SERVER_URL,
});

export const sendTextPrompt = async (
  body: TextPromptBody,
  onStream?: (chunk: string) => void,
) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (onStream) {
    // Use fetch for streaming
    const response = await fetch(`${SERVER_URL}/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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

export const sendAudio = async (body: FormData) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  return server.post("/audio", body, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const sendToCorrection = async (transcript: string) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  return server.post(
    "/correction",
    { transcript },
    {
      headers: {
        Authorization: `${token}`,
      },
    },
  );
};

export const getTitle = async (
  transcript: string,
  notes: string,
  title: string,
  description: string,
) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  return server.post(
    "/title",
    { transcript, notes, title, description },
    {
      headers: {
        Authorization: `${token}`,
      },
    },
  );
};
export default server;
