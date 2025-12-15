import * as z from "zod";

export const ISOToDateObj = z.iso.datetime({offset: true}).pipe(z.transform(iso => new Date(iso)))
export const DateToISOStr = z.date().pipe(z.transform(date => date.toISOString()))

export const LocationSchema = z.object({
    maps_place_id: z.string(),
    address: z.string().min(3),
    latitude: z.number(),
    longitude: z.number()
})