import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekkdqhznzdyxjgablgfm.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { name, email, password, school } = await request.json();

    try {
        console.log(name, email, password, school)
        const { user, err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    school
                }
            }
        });
    
        if (err) {
            throw error(500, "Failed to sign up: " + err.message);
        }
    
        return json({ user });
        
    } catch (error) {
        if (err.body && typeof err.body.message === 'string') {
            throw error(500, "Failed to register user: " + err.body.message);
        } else {
            console.error(err);
            throw error(500, "Failed to register user: Unexpected error.");
        }
    }
    
}