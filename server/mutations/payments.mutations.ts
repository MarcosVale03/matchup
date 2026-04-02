'use server'

import {createClient} from "@/server/db/server";
import {cookies} from 'next/headers';
import {stripe} from "@/server/stripe/client";
import {MutationResponse} from "@/lib/types/types";

type PaymentIntentErrors = {
    tournament_id?: string[],
}

type RegistrationErrors = {
    tournament_id?: string[],
}


export async function registerForFreeTournament(
    tournamentId: number
): Promise<MutationResponse<null, RegistrationErrors>> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Verify user is authenticated
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            success: false,
            formErrors: ["You must be logged in to register for a tournament."],
        };
    }

    // Fetch tournament to verify it exists and is free
    const {data: tournament, error: tournamentError} = await supabase
        .from('tournaments')
        .select('id, entry_fee_cents')
        .eq('id', tournamentId)
        .maybeSingle();

    if (tournamentError) {
        throw new Error("Failed to fetch tournament: " + tournamentError.message);
    }

    if (!tournament) {
        return {
            success: false,
            fieldErrors: {tournament_id: ["Tournament not found."]},
        };
    }

    if (tournament.entry_fee_cents > 0) {
        return {
            success: false,
            formErrors: ["This tournament requires payment to register."],
        };
    }

    // Check if already registered
    const {data: existing} = await supabase
        .from('attendees')
        .select('tournament_id')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existing) {
        return {
            success: false,
            formErrors: ["You are already registered for this tournament."],
        };
    }

    // Insert attendee
    const {error: insertError} = await supabase
        .from('attendees')
        .insert({tournament_id: tournamentId, user_id: user.id});

    if (insertError) {
        throw new Error("Failed to register: " + insertError.message);
    }

    return {success: true};
}


export async function createEntryFeePaymentIntent(
    tournamentId: number
): Promise<MutationResponse<{ clientSecret: string }, PaymentIntentErrors>> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Verify user is authenticated
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            success: false,
            formErrors: ["You must be logged in to register for a tournament."],
        };
    }

    // Fetch tournament to verify it exists and has an entry fee
    const {data: tournament, error: tournamentError} = await supabase
        .from('tournaments')
        .select('id, entry_fee_cents, currency, name')
        .eq('id', tournamentId)
        .maybeSingle();

    if (tournamentError) {
        throw new Error("Failed to fetch tournament: " + tournamentError.message);
    }

    if (!tournament) {
        return {
            success: false,
            fieldErrors: {tournament_id: ["Tournament not found."]},
        };
    }

    if (tournament.entry_fee_cents <= 0) {
        return {
            success: false,
            formErrors: ["This tournament is free. No payment required."],
        };
    }

    // Check if user has already paid for this tournament
    const {data: existingPayment} = await supabase
        .from('payments')
        .select('id, status')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingPayment?.status === 'succeeded') {
        return {
            success: false,
            formErrors: ["You have already paid for this tournament."],
        };
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: tournament.entry_fee_cents,
        currency: (tournament.currency ?? 'usd').toLowerCase(),
        metadata: {
            tournament_id: tournamentId.toString(),
            user_id: user.id,
            tournament_name: tournament.name,
        },
    });

    if (!paymentIntent.client_secret) {
        throw new Error("Stripe failed to create a payment intent.");
    }

    return {
        success: true,
        data: {clientSecret: paymentIntent.client_secret},
    };
}