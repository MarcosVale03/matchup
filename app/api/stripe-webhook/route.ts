import {NextRequest, NextResponse} from 'next/server';
import {stripe} from '@/server/stripe/client';
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

    // Verify the webhook signature
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({error: 'Invalid signature'}, {status: 400});
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentSuccess(paymentIntent);
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentFailure(paymentIntent);
            break;
        }
        default:
            break;
    }

    return NextResponse.json({received: true});
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const tournamentId = paymentIntent.metadata.tournament_id;
    const userId = paymentIntent.metadata.user_id;

    if (!tournamentId || !userId) {
        console.error('Missing metadata on PaymentIntent:', paymentIntent.id);
        return;
    }

    const supabase = createServiceRoleClient();

    const {error: paymentError} = await supabase
        .from('payments')
        .upsert({
            tournament_id: parseInt(tournamentId),
            user_id: userId,
            stripe_payment_intent_id: paymentIntent.id,
            amount_cents: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'succeeded',
        }, {
            onConflict: 'tournament_id,user_id',
        });

    if (paymentError) {
        console.error('Failed to upsert payment record:', paymentError);
        return;
    }

    // Register user as attendee
    const {error: attendeeError} = await supabase
        .from('attendees')
        .upsert({
            tournament_id: parseInt(tournamentId),
            user_id: userId,
        }, {
            onConflict: 'tournament_id,user_id',
        });

    if (attendeeError) {
        console.error('Failed to register attendee:', attendeeError);
    }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const tournamentId = paymentIntent.metadata.tournament_id;
    const userId = paymentIntent.metadata.user_id;

    if (!tournamentId || !userId) {
        return;
    }

    const supabase = createServiceRoleClient();

    // Record the failed payment
    const {error} = await supabase
        .from('payments')
        .upsert({
            tournament_id: parseInt(tournamentId),
            user_id: userId,
            stripe_payment_intent_id: paymentIntent.id,
            amount_cents: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'failed',
        }, {
            onConflict: 'tournament_id,user_id',
        });

    if (error) {
        console.error('Failed to record failed payment:', error);
    }
}