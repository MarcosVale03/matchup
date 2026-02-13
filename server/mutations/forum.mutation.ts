'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types";

// Insert Threads
const ForumThreadInsertSchema = z.object({
    title : z.string().min(1).max(300),
    content : z.string().min(1).max(1500)
})

export type ForumThreadInsertErrors = {
    title? : string[],
    content? : string[]
}

export async function insertForumThread(title : string, content : string) : Promise<MutationResponse<void, ForumThreadInsertErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = ForumThreadInsertSchema.safeParse({
        title : title,
        content : content
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    const {data, error} = await supabase.rpc('insert_thread', {
        t_title : result.data.title,
        t_content : result.data.content
    })

    if (error) {
        throw new Error("Forum Thread Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
    }
}

// Insert Posts
const PostInsertSchema = z.object({
    thread_id : z.string().uuid(),
    content : z.string().min(1).max(1500)
})

export type PostInsertErrors = {
    thread_id? : string[],
    content? : string[]
}

export async function insertPost(thread_id : string, content : string) : Promise<MutationResponse<void, PostInsertErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = PostInsertSchema.safeParse({
        thread_id : thread_id,
        content : content
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    const {data, error} = await supabase.rpc('insert_post', {
        p_thread_id : result.data.thread_id,
        p_content : result.data.content
    })

    if (error) {
        throw new Error("Post Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
    }
}

// Update Post
const PostUpdateSchema = z.object({
    post_id : z.string().uuid(),
    new_content : z.string().min(1).max(1500)
})

export type PostUpdateErrors = {
    post_id? : string[],
    new_content? : string[]
}

export async function updatePost(post_id : string, new_content : string) : Promise<MutationResponse<void, PostUpdateErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const result = PostUpdateSchema.safeParse({
        post_id : post_id,
        new_content : new_content 
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }
    
    const {data, error} = await supabase.rpc('update_post', {
        p_post_id : result.data.post_id,
        p_new_content : result.data.new_content
    })

    if (error) {
        throw new Error("Post Update Transaction Failed:" + error.details + " " + error.message)
    }

    return {
        success : true,
    }
}

// Delete Thread
export async function deleteThread(thread_id : string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const {error} = await supabase.from('forum_thread').delete().eq('id', thread_id)
    if (error) {
        throw new Error("DB Error while trying to delete from Threads" + error.details + " " + error.message)
    }
    return {
        success : true
    }
}

// Delete Post
export async function deletePost(post_id : string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const {error} = await supabase.from('forum_posts').delete().eq('id', post_id)
    if (error) {
        throw new Error("DB Error while trying to delete Post" + error.details + " " + error.message)
    }
    return {
        success : true
    }
}
