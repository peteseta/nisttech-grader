import { json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/** @type {import('./$types').RequestHandler} */
export async function POST({ _request }) {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(500, "Failed to logout... " + err.message);
        }

        return json();
        
    } catch (error) {
        if (error.body && typeof error.body.message === 'string') {
            throw new Error(500, "Failed to logout: " + err.body.message);
        } else {
            console.error(error);
            throw new Error(500, "Failed to logout: Unexpected error.");
        }
    }
}