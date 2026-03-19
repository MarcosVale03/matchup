/**
 * Formats a Date object into a readable string without seconds.
 * @param date The Date object to format.
 * @returns The formatted date and time string (Month Day, Year @ HH:MM.
 */
export function formatDateTime(date?: Date | string): string {
    if (!date) return "N/A";

    const newDate = typeof date === "string" ? new Date(date) : date;
    if (isNaN(newDate.getTime())) return "N/A";

    const datePart = newDate.toLocaleString("en-US", {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const timePart = newDate.toLocaleString("en-US", {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).toLowerCase().replace(' ', '');

    return `${datePart} @ ${timePart}`;
}

/**
 * Formats a date for use in <input type="datetime-local">
 * Returns string in format: "YYYY-MM-DDTHH:mm"
 */
export function toDateTimeLocalInput(dateInput: Date | string | null | undefined): string {
    if (!dateInput) return '';

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) return '';

    const year   = date.getFullYear();
    const month  = String(date.getMonth() + 1).padStart(2, '0');
    const day    = String(date.getDate()).padStart(2, '0');
    const hours  = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
