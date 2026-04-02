import {NextRequest, NextResponse} from 'next/server';
import {getStripe} from '@/server/stripe/client';
import {createClient} from '@supabase/supabase-js';
import {Database} from '@/lib/types/db.types';
import Stripe from 'stripe';

function createServiceRoleClient() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({error: 'Missing stripe-signature header'}, {status: 400});
    }

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook signature verification failed:', message);
        return NextResponse.json({error: 'Invalid signature'}, {status: 400});
    }

    const supabase = createServiceRoleClient();

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const {tournament_id, user_id} = paymentIntent.metadata;

            if (!tournament_id || !user_id) {
                console.error('Missing metadata on payment intent:', paymentIntent.id);
                break;
            }

            // Record the payment
            await supabase.from('payments').upsert(
                {
                    tournament_id: Number(tournament_id),
                    user_id,
                    stripe_payment_intent_id: paymentIntent.id,
                    amount_cents: paymentIntent.amount,
                    currency: paymentIntent.currency.toUpperCase(),
                    status: 'succeeded',
                },
                {onConflict: 'tournament_id,user_id'},
            );

            // Register the user as an attendee
            await supabase.from('attendees').upsert(
                {
                    tournament_id: Number(tournament_id),
                    user_id,
                },
                {onConflict: 'tournament_id,user_id'},
            );

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const {tournament_id, user_id} = paymentIntent.metadata;

            if (tournament_id && user_id) {
                await supabase.from('payments').upsert(
                    {
                        tournament_id: Number(tournament_id),
                        user_id,
                        stripe_payment_intent_id: paymentIntent.id,
                        amount_cents: paymentIntent.amount,
                        currency: paymentIntent.currency.toUpperCase(),
                        status: 'failed',
                    },
                    {onConflict: 'tournament_id,user_id'},
                );
            }

            break;
        }
    }

    return NextResponse.json({received: true});
}
