/**
 * Safely extracts standard input date string (YYYY-MM-DD)
 * Handles ISO strings, MySQL DATE strings, and Date objects without timezone shifts.
 */
export function formatDateForInput(date?: string | Date | null): string {
  if (!date) return "";
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return String(date).split("T")[0] || "";
}

export function formatDateForDisplay(
  date?: string | Date | null,
  locale: string = "en-GB", // DD/MM/YYYY
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
): string {
  if (!date) return "N/A";
  const dateStr = formatDateForInput(date);
  if (!dateStr) return "N/A";

  const parsedDate = new Date(`${dateStr}T12:00:00`);
  if (isNaN(parsedDate.getTime())) return String(date);

  return new Intl.DateTimeFormat(locale, options).format(parsedDate);
}
