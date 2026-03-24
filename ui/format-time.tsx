/*** Formats a date for use in <input type="datetime-local">
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
