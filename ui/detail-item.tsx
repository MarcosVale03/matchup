import React from "react";

export default function DetailItem({ icon, label, value, accent = false, }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    accent?: boolean;
}) {
    return (
        <div className="flex items-start gap-4">
            <div
                className={`rounded-lg p-3 ${accent ? "bg-cyan-950/50 text-cyan-300" : "bg-slate-800/70 text-slate-400"}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-medium uppercase tracking-wide text-slate-500">{label}</h4>
                <div className={`mt-1 text-lg ${accent ? "text-cyan-200 font-medium" : "text-slate-200"}`}>{value}</div>
            </div>
        </div>
    );
}