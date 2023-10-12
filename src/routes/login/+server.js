import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { email, password } = await request.json();

    try {
        const { data, err } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
    
        if (err) {
            throw error(500, "Failed to login: " + err.message);
        }
    
        request.locals.session.userId = data.user.id;
        return json({ user: data.user });
        
    } catch (error) {
        if (err.body && typeof err.body.message === 'string') {
            throw error(500, "Failed to login: " + err.body.message);
        } else {
            console.error(err);
            throw error(500, "Failed to login: Unexpected error.");
        }
    }
    
}