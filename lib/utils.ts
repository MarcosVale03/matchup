export const dateToInputString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const outDate = new Date(date.getTime() - offset);
    return outDate.toISOString().substring(0, 16);
};