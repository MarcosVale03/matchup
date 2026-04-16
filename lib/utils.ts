export const dateToInputString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const outDate = new Date(date.getTime() - offset);
    return outDate.toISOString().substring(0, 16);
};

export function getTimeUntilStart(startTime: Date, endTime: Date): string {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();

    if (diff <= 0) {
        const ended = endTime.getTime() - now.getTime();
        if (ended <= 0) return "Ended";
        return "LIVE";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
}