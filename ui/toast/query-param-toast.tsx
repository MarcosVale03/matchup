'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';

export function QueryParamToast({
    paramKey,
    expectedValue = '1',
    message,
    duration = 4000,
}: {
    paramKey: string;
    expectedValue?: string;
    message: string;
    duration?: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const matched = searchParams.get(paramKey) === expectedValue;

    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(matched);

    useEffect(() => {
        if (!matched) return;

        // Strip the triggering param from the URL so refresh won't re-fire.
        const next = new URLSearchParams(searchParams.toString());
        next.delete(paramKey);
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

        // Slide in on the next frame.
        const showId = requestAnimationFrame(() => setVisible(true));

        // Slide out after duration, unmount after the transition.
        const hideTimer = setTimeout(() => setVisible(false), duration);
        const unmountTimer = setTimeout(() => setMounted(false), duration + 300);

        return () => {
            cancelAnimationFrame(showId);
            clearTimeout(hideTimer);
            clearTimeout(unmountTimer);
        };
        // Only rerun if the matched state flips (don't retrigger on every router change).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matched]);

    if (!mounted) return null;

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setMounted(false), 300);
    };

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8
                        transition-all duration-300 ease-out
                        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        >
            <div
                className="flex items-center gap-3 bg-primary text-white
                           font-poppins font-semibold text-sm md:text-base
                           px-4 py-3 rounded-xl shadow-lg border-2 border-secondary
                           tracking-tight max-w-[min(92vw,28rem)]"
            >
                <CheckCircle2 className="size-5 shrink-0" />
                <span className="flex-1">{message}</span>
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Dismiss"
                    className="shrink-0 rounded-md p-0.5 hover:bg-secondary transition-colors cursor-pointer"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
