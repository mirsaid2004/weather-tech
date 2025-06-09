export function formatOffset(offsetInSeconds: number): string {
  const offsetInHours = offsetInSeconds / 3600;
  const sign = offsetInHours >= 0 ? "+" : "−";
  const absOffset = Math.abs(offsetInHours);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset % 1) * 60);

  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
