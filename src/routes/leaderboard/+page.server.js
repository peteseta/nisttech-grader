import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function load() {
  const { data } = await supabase
    .from("leaderboard")
    .select();
  return {
    submissions: data ?? [],
  };
}
