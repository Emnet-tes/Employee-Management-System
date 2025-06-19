export function calculateWorkHours(
  checkIn: string | undefined,
  checkOut: string | undefined
) {
  if (!checkIn || !checkOut) return "-";

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return "-";

  let diffMs = outDate.getTime() - inDate.getTime();

  // Handle overnight (checkOut on next day)
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
}
