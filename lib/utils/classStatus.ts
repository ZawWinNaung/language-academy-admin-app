export type CalculatedClassStatus = "Upcoming" | "Ongoing" | "Completed";

export function calculateClassStatus(
  startDate: string | Date,
  endDate: string | Date,
): string {
  if (!startDate || !endDate) return "Upcoming";

  const now = new Date();
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (now < start) {
    return "Upcoming";
  } else if (now >= start && now <= end) {
    return "Ongoing";
  } else {
    return "Completed";
  }
}
