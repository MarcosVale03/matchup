// Define the desired formatting options once
const customDateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short', // Use 'short' (e.g., Dec) or 'numeric' (e.g., 12)
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use AM/PM format
};

/**
 * Formats a Date object into a readable string without seconds.
 * @param date The Date object to format.
 * @returns The formatted date and time string.
 */
export function formatTournamentDateTime(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'N/A';
    }
    
    return date.toLocaleString(undefined, customDateTimeOptions);
}
