'use client'

import { useRouter } from "next/navigation";

export function BackButton({ buttonClass, text }: {buttonClass: string, text: string}) {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <button type="button" className={buttonClass} onClick={handleBackClick}>
            {text}
        </button>
    )
}