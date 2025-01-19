import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY } from "./const";

const supabaseUrl = "https://svitvmdryoqgopmseuhd.supabase.co";

export const supabase = createClient(supabaseUrl, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  },
});
