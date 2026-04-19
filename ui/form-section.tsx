import React from "react";

export function FormSection({
    title,
    children,
    className,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`py-4 border-t border-gray-200 first:border-t-0 first:pt-0 ${className ?? ""}`}
        >
            <h5 className="text-primary mb-1 tracking-tight">
                {title}
            </h5>
            {children}
        </section>
    );
}
