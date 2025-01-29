import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY } from "./const";
import { Database, Tables } from "./supabase.types";
import { useQuery } from "@tanstack/react-query";

const supabaseUrl = "https://svitvmdryoqgopmseuhd.supabase.co";

export const supabase = createClient<Database>(supabaseUrl, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  },
});

// props: {"title": "Meeting Type Definition", "runQuery": "false"}
export type Meeting = Tables<"meeting">;

export interface ChatItem {
  actor: "user" | "agent";
  content: string;
}

export interface TextPromptBody {
  meeting: Meeting;
  type: "summary" | "chat";
  note: string;
  chatQuestion: string;
}
