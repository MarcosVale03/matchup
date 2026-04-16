'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types";

// creating insert schema with table objects
const ForumThreadInsertSchema = z.object({
    title : z.string().min(1).max(300),
    content : z.string().min(1).max(1500)
})

// initializing thread insert errors
export type ForumThreadInsertErrors = {
    title? : string[],
    content? : string[]
}

// this function inserts a thread into the DB with the title and content, other data is done by supabase 
export async function insertForumThread(title : string, content : string) : Promise<MutationResponse<void, ForumThreadInsertErrors>> {

    // creatint client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parsing the title and contet 
    const result = ForumThreadInsertSchema.safeParse({
        title : title,
        content : content
    })

    // error check and displaying a message
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    // inserting data into DB Thread table
    const {data, error} = await supabase.rpc('insert_thread', {
        t_title : result.data.title,
        t_content : result.data.content
    })

    // Checking for errors in inserting data
    if (error) {
        throw new Error("Forum Thread Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // returning success 
    return {
        success: true,
    }
}

// creating post insert schema with objects 
const PostInsertSchema = z.object({
    thread_id : z.string().uuid(),
    content : z.string().min(1).max(1500)
})

// init post insert errors
export type PostInsertErrors = {
    thread_id? : string[],
    content? : string[]
}

// this function inserts the post into the Post table in our DB
export async function insertPost(thread_id : string, content : string) : Promise<MutationResponse<void, PostInsertErrors>> {

    // creating our client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parsing our post insert schema
    const result = PostInsertSchema.safeParse({
        thread_id : thread_id,
        content : content
    })

    // checking for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    // inserting our post data into the db table, other data done by supabase
    const {data, error} = await supabase.rpc('insert_post', {
        p_thread_id : result.data.thread_id,
        p_content : result.data.content
    })

    // checking if inserting gave any errros
    if (error) {
        throw new Error("Post Insert Transaction Failed: " + error.details + " " + error.message)
    }


    // returning success
    return {
        success: true,
        data: data
    }
}

// creating our shema for editing posts
const PostUpdateSchema = z.object({
    post_id : z.string().uuid(),
    new_content : z.string().min(1).max(1500)
})

// init post update errors 
export type PostUpdateErrors = {
    post_id? : string[],
    new_content? : string[]
}

// this fucntion updates the Post table with new data (user edits their post)
export async function updatePost(post_id : string, new_content : string) : Promise<MutationResponse<void, PostUpdateErrors>> {

    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // parsing our update schema 
    const result = PostUpdateSchema.safeParse({
        post_id : post_id,
        new_content : new_content 
    })

    // checking for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }
    
    // inserting the new data into the db 
    const {data, error} = await supabase.rpc('update_post', {
        p_post_id : result.data.post_id,
        p_new_content : result.data.new_content
    })

    // checking for any errors 
    if (error) {
        throw new Error("Post Update Transaction Failed:" + error.details + " " + error.message)
    }

    // returning success
    return {
        success : true,
    }
}

// this function deletes a thread 
export async function deleteThread(thread_id : string) {
    
    // creates client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // looks for thread by ID and deletes it 
    const {error} = await supabase.from('forum_thread').delete().eq('id', thread_id)

    // checks for any errors when deleting
    if (error) {
        throw new Error("DB Error while trying to delete from Threads" + error.details + " " + error.message)
    }

    // returns success
    return {
        success : true
    }
}

// this function deletes post
export async function deletePost(post_id : string) {

    // creates client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // looks for post by post id and deletes it 
    const {error} = await supabase.from('forum_posts').delete().eq('id', post_id)

    // checks for errors when deleting 
    if (error) {
        throw new Error("DB Error while trying to delete Post" + error.details + " " + error.message)
    }

    // returns success
    return {
        success : true
    }
}
