import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function load() {
  const { data: submissionsData } = await supabase.from("past_submissions")
    .select();
  const { data: problemsData } = await supabase.from("problems").select();

//   console.log("finished querying:", submissionsData, problemsData)

  return {
    submissions: submissionsData ?? [],
    problems: problemsData ?? [],
  };
}
