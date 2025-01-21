import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY } from "./const";

const supabaseUrl = "https://svitvmdryoqgopmseuhd.supabase.co";

export const supabase = createClient(supabaseUrl, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  },
});

// props: {"title": "Meeting Type Definition", "runQuery": "false"}
export interface Meeting {
  id: number; // Primary key
  user_id: string; // Foreign key referencing the user's ID
  title: string; // Title of the meeting
  description?: string; // Optional description of the meeting
  start_time: string; // Start time of the meeting in ISO format
  end_time: string; // End time of the meeting in ISO format
  created_at: string; // Timestamp when the meeting was created
  updated_at: string; // Timestamp when the meeting was last updated
}
