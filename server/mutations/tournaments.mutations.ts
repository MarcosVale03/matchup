'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"

import {DateToISOStr, LocationSchema} from "@/lib/types/zod.types";
import {MutationResponse} from "@/lib/types/types";
import {UNALLOWED_SLUGS} from "@/lib/constants";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";

const TournamentSchema = z.object({
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
    }).refine(data => data.email || data.discord, {error: "Must provide at least one contact"}),
    is_public: z.boolean(),
}).refine(data => data.is_online || data.location, {error: "Need location for offline tournament", path: ["location"],})

const TournamentInsertSchema = TournamentSchema
    .refine(data => data.slug ? isSlugUnique(data.slug) : true,{error: "This slug is taken", path: ["slug"],})


export type TournamentInsertErrors = {
    name?: string[],
    slug?: string[],
    times?: string[],
    is_online?: string[],
    location?: string[],
    contact?: string[],
    is_public?: string[],
}


/**
 * Inserts a new tournament row into the tournaments table of the database.
 * @param {string} name - The name of the tournament.
 * @param {Date} startTime - The start date and time of the tournament.
 * @param {Date} endTime - The end date and time of the tournament. Must be later than start_time.
 * @param {boolean} isOnline - True if the tournament is an online tournament. False if the tournament is offline.
 * @param {Object} contact - Object containing either a contact email or discord invite link. One of the two must be present.
 * @param {string} contact.email - Email used to contact tournament organizers.
 * @param {string} contact.discord - Discord invite link to the tournament discord.
 * @param {boolean} [isPublic] - Optional. True if the tournament is a public tournament. False if the tournament is private.
 * @param {string} [slug] - Optional slug to use as a shorter link to the tournament.
 * @param {Object} [location] - Location data for an offline tournament. Required only if isOnline is false.
 * @param {string} location.maps_place_id - Google Maps place id for the given location.
 * @param {string} location.address - Written address for the given location.
 * @param {number} location.latitude - Latitude coordinate of the given location.
 * @param {number} location.longitute - Longitude coordinate of the given location.
 *
 * @returns Response from mutation.
 * @returns success - True if the DB mutation is successful. False if it fails.
 * @returns formErrors - Optional. Contains error messages that apply to the whole form.
 * @returns fieldErrors - Optional. Contains error messages that apply to specific parts of the form.
 * @returns data - Returns tournament id of inserted tournament if success is true
 *
 * @throws - Will throw an exception if an error occurs while entering data into the database..
 */
export async function insertTournament(name: string, startTime: Date, endTime: Date, isOnline: boolean,
                                       contact: {
                                            email?: string,
                                            discord?: string,
                                       },
                                       isPublic?: boolean, slug?: string,
                                       location?: {
                                            maps_place_id: string,
                                            address: string,
                                            latitude: number,
                                            longitude: number
                                       },
                                     ): Promise<MutationResponse<number, TournamentInsertErrors>> {
    // Create supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Validates data using Zod schema
    const result = await TournamentInsertSchema.safeParseAsync({
        name: name,
        slug: slug,
        times: {
            start_time: startTime,
            end_time: endTime
        },
        is_online: isOnline,
        location: location,
        contact: contact,
        is_public: isPublic,
    })

    // Returns errors if validation isn't successful
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }


    // Attempts to add row to database
    const {data, error} = await supabase.rpc('insert_tournament', {
        t_name: result.data.name,
        t_start_time: result.data.times.start_time,
        t_end_time: result.data.times.end_time,
        t_is_online: result.data.is_online,
        t_email: result.data.contact.email,
        t_discord: result.data.contact.discord,
        t_slug: result.data.slug,
        t_place_id: result.data.location?.maps_place_id,
        t_address: result.data.location?.address,
        t_latitude: result.data.location?.latitude,
        t_longitude: result.data.location?.longitude,
        t_is_public: result.data.is_public,
    })

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // Returns successful
    return {
        success: true,
        data: data
    }
}


/**
 * Returns true if slug doesn't already exist in the database.
 * @param slug
 * @param id
 */
async function isSlugUnique(slug: string, id?: number) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select('id').eq('slug', slug).maybeSingle()
    if (error) {
        throw new Error("DB error while querying tournaments: " + error.details + " " + error.message)
    }

    return !data || (id ? id === data.id : false)
}



const TournamentUpdateSchema = TournamentSchema.safeExtend({id: z.number().refine(data => doesTournamentExist(data), {error: "Tournament ID doesn't exist"})})
    .refine(data => data.slug ? isSlugUnique(data.slug, data.id) : true, {error: "This slug is taken", path: ["slug"],})

export type TournamentUpdateErrors = {
    id?: string[],
    name?: string[],
    slug?: string[],
    times?: string[],
    is_online?: string[],
    location?: string[],
    contact?: string[]
}

/**
 * Updates an existing tournament row in the tournaments table of the database.
 * @param {number} id - The id of the tournament.
 * @param {string} name - The name of the tournament.
 * @param {Date} startTime - The start date and time of the tournament.
 * @param {Date} endTime - The end date and time of the tournament. Must be later than start_time.
 * @param {boolean} isOnline - True if the tournament is an online tournament. False if the tournament is offline.
 * @param {Object} contact - Object containing either a contact email or discord invite link. One of the two must be present.
 * @param {string} contact.email - Email used to contact tournament organizers.
 * @param {string} contact.discord - Discord invite link to the tournament discord.
 * @param {boolean} [isPublic] - Optional. True if the tournament is a public tournament. False if the tournament is private.
 * @param {string} [slug] - Optional slug to use as a shorter link to the tournament.
 * @param {Object} [location] - Location data for an offline tournament. Required only if isOnline is false.
 * @param {string} location.maps_place_id - Google Maps place id for the given location.
 * @param {string} location.address - Written address for the given location.
 * @param {number} location.latitude - Latitude coordinate of the given location.
 * @param {number} location.longitute - Longitude coordinate of the given location.
 *
 * @returns Response from mutation.
 * @returns success - True if the DB mutation is successful. False if there are invalid parameters.
 * @returns formErrors - Optional. Contains error messages that apply to the whole form.
 * @returns fieldErrors - Optional. Contains error messages that apply to specific parts of the form.
 * @returns data - Returns tournament id of updated tournament if success is true.
 *
 * @throws - Will throw an exception if an error occurs while entering data into the database.
 */
export async function updateTournament(id: number, name: string, startTime: Date, endTime: Date, isOnline: boolean,
                                       contact: {
                                           email?: string,
                                           discord?: string,
                                       },
                                       isPublic?: boolean, slug?: string,
                                       location?: {
                                           maps_place_id: string,
                                           address: string,
                                           latitude: number,
                                           longitude: number
                                       },
): Promise<MutationResponse<number, TournamentUpdateErrors>> {
    // Creates supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Validates data using Zod schema
    const result = await TournamentUpdateSchema.safeParseAsync({
        id: id,
        name: name,
        slug: slug,
        times: {
            start_time: startTime,
            end_time: endTime
        },
        is_online: isOnline,
        location: location,
        contact: contact,
        is_public: isPublic
    })

    // Returns errors if validation isn't successful
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }


    // Attempts to update row in database
    const {data, error} = await supabase.rpc('update_tournament', {
        t_id: result.data.id,
        t_name: result.data.name,
        t_start_time: result.data.times.start_time,
        t_end_time: result.data.times.end_time,
        t_is_online: result.data.is_online,
        t_email: result.data.contact.email,
        t_discord: result.data.contact.discord,
        t_slug: result.data.slug,
        t_place_id: result.data.location?.maps_place_id,
        t_address: result.data.location?.address,
        t_latitude: result.data.location?.latitude,
        t_longitude: result.data.location?.longitude,
        t_is_public: result.data.is_public,
    })

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Update Transaction Failed: " + error.details + " " + error.message)
    }

    // Returns successful
    return {
        success: true,
        data: data
    }
}


/**
 * Deletes a given tournament from the database.
 * @param id - ID of the tournament to be deleted
 *
 * @returns Response from mutation.
 * @returns success - True if the DB mutation is successful. False if there are invalid parameters.
 *
 * @throws - Will throw an exception if an error occurs while entering data into the database.
 */
export async function deleteTournament(id: number) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    if (!(await doesTournamentExist(id))) {
        return {
            success: false
        }
    }

    const {error} = await supabase.from('tournaments').delete().eq('id', id)
    if (error) {
        throw new Error("DB error while trying to delete from tournaments: " + error.details + " " + error.message)
    }
    return {
        success: true
    }
}