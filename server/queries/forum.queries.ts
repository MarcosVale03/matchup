'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";


// initializing out Thread and Post variables
type Thread = Database['public']['Tables']['forum_thread']['Row']
type Post = Database['public']['Tables']['forum_posts']['Row']


// function that will get all threads from our DB
export async function fetchThreads() : Promise<QueryResponse<Thread[]>> {


    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)


    // getting all threads from our table called forum_thread in the DB
    const {data, error} = await supabase.from('forum_thread').select()
   
    // checking and displaying a message if we run into an error
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }


    // returning data from DB
    return {
        success : true,
        data : data
    }
}


// getting all posts under a specific thread
export async function fetchThreadWithPosts(thread_id : string) : Promise<QueryResponse<Post[]>> {


    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)


    // getting all posts from our posts table that have the thread id equal to passed argument
    const {data, error} = await supabase.from('forum_posts').select('*').eq('thread_id', thread_id)


    // checking and displaying a message if we run into an error
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }


    // returning data from DB
    return {
        success : true,
        data : data
    }
}
