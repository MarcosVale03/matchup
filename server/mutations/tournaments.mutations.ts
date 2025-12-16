'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"

import {DateToISOStr, LocationSchema} from "@/lib/types/zod.types";
import {MutationResponse} from "@/lib/types/types";
import {UNALLOWED_SLUGS} from "@/lib/constants";
import {SupabaseClient} from "@supabase/supabase-js";

const TournamentInsertSchema = z.object({
    name: z.string().min(3).max(80),
    slug: z.optional(z.string().min(3).max(80).superRefine((slug, ctx) => {
        if (UNALLOWED_SLUGS.includes(slug)) {
            ctx.addIssue({
                code: "custom",
                message: `Value not allowed`,
                input: slug
            })
        }
        if (!/^[a-zA-Z0-9]+$/.test(slug)) {
            ctx.addIssue({
                code: "custom",
                message: "Slug must be all alphanumeric characters",
                input: slug
            })
        }
    })),
    times: z.object({
        start_time: DateToISOStr,
        end_time: DateToISOStr
    }).refine(data => data.start_time < data.end_time, {error: "Start time must be before end time"}),
    is_online: z.boolean(),
    location: z.optional(LocationSchema),
    contact: z.object({
        email: z.optional(z.email().max(254)),
        discord: z.optional(z.stringFormat("discord link",
            new RegExp("(https?://)?(www.)?(discord.gg|discordapp.com)(/invite)?/[^\\s/]{8}?(?=\\b)")).pipe(
                z.transform(link => link.slice(-8))
        ))
    }).refine(data => data.email || data.discord, {error: "Must provide at least one contact"})
}).refine(data => data.is_online || data.location, {error: "Need location for offline event", path: ["location"],})

export type TournamentInsertErrors = {
    name?: string[],
    slug?: string[],
    times?: string[],
    is_online?: string[],
    location?: string[],
    contact?: string[]
}

export async function insertTournament(name: string, start_time: Date, end_time: Date, isOnline: boolean,
                                       contact: {
                                            email?: string,
                                            discord?: string,
                                       },
                                       slug?: string,
                                       location?: {
                                            maps_place_id: string,
                                            address: string,
                                            latitude: number,
                                            longitude: number
                                       },
                                     ): Promise<MutationResponse<number, TournamentInsertErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = TournamentInsertSchema.safeParse({
        name: name,
        slug: slug,
        times: {
            start_time: start_time,
            end_time: end_time
        },
        is_online: isOnline,
        location: location,
        contact: contact
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix above errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    if (slug) {
        const unique = await isSlugUnique(supabase, slug)
        if (!unique) {
            return {
                success: false,
                fieldErrors: {slug: ["This slug is taken"]}
            }
        }
    }

    const {data, error} = await supabase.rpc('insert_tournament', {
        t_name: result.data.name,
        t_start_time: result.data.times.start_time,
        t_end_time: result.data.times.end_time,
        is_online: result.data.is_online,
        t_email: result.data.contact.email,
        t_discord: result.data.contact.discord,
        t_slug: result.data.slug,
        t_place_id: result.data.location?.maps_place_id,
        t_address: result.data.location?.address,
        t_latitude: result.data.location?.latitude,
        t_longitude: result.data.location?.longitude
    })

    if (error) {
        throw new Error("Tournament Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
        data: data
    }
}

async function isSlugUnique(supabase: SupabaseClient, slug: string, id?: number) {
    const {data, error} = await supabase.from('tournaments').select('id').eq('slug', slug)
    if (error || !data) {
        throw new Error("DB error while querying tournaments: " + error.details + " " + error.message)
    }
    return data.length == 0 || (id ? id == data[0].id : false)
}



const TournamentUpdateSchema = TournamentInsertSchema.safeExtend({id: z.number()})

type TournamentUpdateErrors = {
    id?: string[],
    name?: string[],
    slug?: string[],
    times?: string[],
    is_online?: string[],
    location?: string[],
    contact?: string[]
}

export async function updateTournament(id: number, name: string, start_time: Date, end_time: Date, isOnline: boolean,
                                       contact: {
                                           email?: string,
                                           discord?: string,
                                       },
                                       slug?: string,
                                       location?: {
                                           maps_place_id: string,
                                           address: string,
                                           latitude: number,
                                           longitude: number
                                       },
): Promise<MutationResponse<number, TournamentUpdateErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = TournamentUpdateSchema.safeParse({
        id: id,
        name: name,
        slug: slug,
        times: {
            start_time: start_time,
            end_time: end_time
        },
        is_online: isOnline,
        location: location,
        contact: contact
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix above errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    if (slug) {
        const unique = await isSlugUnique(supabase, slug, id)
        if (!unique) {
            return {
                success: false,
                fieldErrors: {slug: ["This slug is taken"]}
            }
        }
    }

    const {data, error} = await supabase.rpc('update_tournament', {
        t_id: result.data.id,
        t_name: result.data.name,
        t_start_time: result.data.times.start_time,
        t_end_time: result.data.times.end_time,
        is_online: result.data.is_online,
        t_email: result.data.contact.email,
        t_discord: result.data.contact.discord,
        t_slug: result.data.slug,
        t_place_id: result.data.location?.maps_place_id,
        t_address: result.data.location?.address,
        t_latitude: result.data.location?.latitude,
        t_longitude: result.data.location?.longitude
    })

    if (error) {
        throw new Error("Tournament Update Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
        data: data
    }
}



export async function deleteTournament(id: number) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.from('tournaments').delete().eq('id', id)
    if (error) {
        throw new Error("DB Error while trying to delete from tournaments: " + error.details + " " + error.message)
    }
    return {
        success: true,
    }
}