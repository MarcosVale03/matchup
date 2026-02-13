'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

type Thread = Database['public']['Tables']['forum_thread']['Row']
type Post = Database['public']['Tables']['forum_posts']['Row']

export async function fetchThreads() : Promise<QueryResponse<Thread[]>> {

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('forum_thread').select()
    
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }

    return {
        success : true, 
        data : data
    }
}

export async function fetchThreadWithPosts(thread_id : string) : Promise<QueryResponse<Post[]>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('forum_posts').select('*').eq('thread_id', thread_id)
    
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }

    return {
        success : true, 
        data : data
    }
}