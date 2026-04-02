'use client';

import React, {useState, useCallback} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {createEntryFeePaymentIntent} from '@/server/mutations/payments.mutations';
import {DollarSign, X} from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({onSuccess, onCancel}: {onSuccess: () => void; onCancel: () => void}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message ?? 'Payment failed. Please try again.');
            setIsProcessing(false);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement/>

            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="flex gap-3 justify-end mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary
                               transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
}

export function EntryFeeCheckout({
    tournamentId,
    tournamentName,
    entryFeeCents,
    onSuccess: onSuccessCallback,
}: {
    tournamentId: number;
    tournamentName: string;
    entryFeeCents: number;
    onSuccess?: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handleOpen = useCallback(async () => {
        setIsOpen(true);
        setIsLoading(true);
        setError(null);

        try {
            const response = await createEntryFeePaymentIntent(tournamentId);
            if (response.success && response.data) {
                setClientSecret(response.data.clientSecret);
            } else {
                setError(response.formErrors?.join(' ') ?? 'Failed to start payment.');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId]);

    const handleClose = () => {
        setIsOpen(false);
        setClientSecret(null);
        setError(null);
    };

    const handleSuccess = () => {
        setPaymentComplete(true);
        setClientSecret(null);
        onSuccessCallback?.();
    };

    if (paymentComplete) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg
                            font-[Poppins] font-semibold text-sm">
                Payment successful — you&apos;re registered!
            </div>
        );
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="flex items-center justify-center gap-2 p-2 px-4
                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                           text-white bg-primary hover:bg-secondary cursor-pointer
                           transition-colors duration-200"
            >
                <DollarSign className="size-5"/>
                Register (${(entryFeeCents / 100).toFixed(2)})
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={!isLoading ? handleClose : undefined}
                    />

                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-black font-[Poppins]">
                                Register for {tournamentName}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="size-5"/>
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 font-[Poppins]">
                            Entry fee: <span className="font-semibold">${(entryFeeCents / 100).toFixed(2)}</span>
                        </p>

                        {isLoading && (
                            <div className="text-center py-8 text-gray-500 font-[Poppins] text-sm">
                                Setting up payment...
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{clientSecret, appearance: {theme: 'stripe'}}}
                            >
                                <CheckoutForm onSuccess={handleSuccess} onCancel={handleClose}/>
                            </Elements>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
