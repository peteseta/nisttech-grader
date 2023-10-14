import { json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import { derived } from 'svelte/store';

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function load() {
    const { data } = await supabase
    .from("past_submissions")
    .select();
    return {
        submissions: data ?? [],
    };
  }
