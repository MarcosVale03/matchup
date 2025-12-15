import * as z from "zod";

export const isoToDateObj = z.iso.datetime({offset: true}).pipe(z.transform(iso => new Date(iso)))