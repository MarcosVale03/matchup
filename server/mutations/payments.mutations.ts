'use server';

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {getStripe} from "@/server/stripe/client";
import {MutationResponse} from "@/lib/types/types";

type RegistrationErrors = {
    tournament_id?: string[],
}

/// Registers the current user for a free tournament. Returns an error if the tournament 
// is not free, does not exist, or if the user is already registered.

export async function registerForFreeTournament(
    tournamentId: number
): Promise<MutationResponse<null, RegistrationErrors>> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {success: false, formErrors: ["You must be logged in to register."]};
    }

    // Verify tournament exists and is free
    const {data: tournament, error: fetchError} = await supabase
        .from('tournaments')
        .select('id, entry_fee_cents')
        .eq('id', tournamentId)
        .maybeSingle();

    if (fetchError || !tournament) {
        return {success: false, formErrors: ["Tournament not found."]};
    }

    if (tournament.entry_fee_cents > 0) {
        return {success: false, formErrors: ["This tournament requires payment to register."]};
    }

    // Check if already registered
    const {data: existing} = await supabase
        .from('attendees')
        .select('tournament_id')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existing) {
        return {success: false, formErrors: ["You are already registered for this tournament."]};
    }

    // Insert attendee
    const {error: insertError} = await supabase
        .from('attendees')
        .insert({tournament_id: tournamentId, user_id: user.id});

    if (insertError) {
        return {success: false, formErrors: ["Failed to register: " + insertError.message]};
    }

    return {success: true};
}

// Creates a Stripe Payment Intent for the entry fee of a tournament. 
// Returns an error if the tournament does not exist, is free, or if the user already has a pending or successful payment for the tournament.

export async function createEntryFeePaymentIntent(
    tournamentId: number
): Promise<MutationResponse<{clientSecret: string}, RegistrationErrors>> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {success: false, formErrors: ["You must be logged in."]};
    }

    // Fetch tournament
    const {data: tournament, error: fetchError} = await supabase
        .from('tournaments')
        .select('id, name, entry_fee_cents, currency')
        .eq('id', tournamentId)
        .maybeSingle();

    if (fetchError || !tournament) {
        return {success: false, formErrors: ["Tournament not found."]};
    }

    if (tournament.entry_fee_cents <= 0) {
        return {success: false, formErrors: ["This tournament is free."]};
    }

    // Check if already paid
    const {data: existingPayment} = await supabase
        .from('payments')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .in('status', ['succeeded', 'pending'])
        .maybeSingle();

    if (existingPayment) {
        return {success: false, formErrors: ["You already have a payment for this tournament."]};
    }

    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: tournament.entry_fee_cents,
        currency: tournament.currency.toLowerCase(),
        metadata: {
            tournament_id: String(tournament.id),
            user_id: user.id,
            tournament_name: tournament.name,
        },
    });

    if (!paymentIntent.client_secret) {
        return {success: false, formErrors: ["Failed to create payment."]};
    }

    return {success: true, data: {clientSecret: paymentIntent.client_secret}};
}
