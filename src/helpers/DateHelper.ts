export const formatDate = (date?: Date | string, locale?: string, dateOnly?: boolean): string => {
    const loc = locale === undefined ? "it-IT" : locale;

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: dateOnly ? undefined : "2-digit",
        minute: dateOnly ? undefined : "2-digit",
        second: dateOnly ? undefined : "2-digit",
        timeZone: 'Europe/Rome'
    };

    if (typeof date === "string") {
        const dt = new Date(date);
        return new Intl.DateTimeFormat(loc, options).format(dt)
    } else if (date !== undefined) {
        return new Intl.DateTimeFormat(loc, options).format(date)
    }
    return "";
};