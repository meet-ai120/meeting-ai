import axios from "axios";
import { TextPromptBody } from "./supabase";

const server = axios.create({
  baseURL: "http://localhost:8080",
});

export const sendTextPrompt = (body: TextPromptBody) =>
  server.post("/text", body);

export const sendAudio = (body: FormData) => server.post("/audio", body);

export default server;
