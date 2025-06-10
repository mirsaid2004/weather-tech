import timezones from "@/assets/data/timezones.json";
import { formatOffset } from "./offset-format";

export function getTimeZoneInfo(
  offsetInSeconds?: number,
  utc?: string,
): {
  name: string;
  label: string;
} {
  if (!offsetInSeconds || !utc) return { name: "Unknown", label: "Unknown" };
  const offsetMinutes = offsetInSeconds / 60;
  const offsetInHours = offsetMinutes / 60;

  console.log({ offsetInHours });

  for (const tz of timezones) {
    if (tz.offset === offsetInHours && tz.utc.includes(utc)) {
      return {
        name: tz.value,
        label: tz.text,
      };
    }
  }

  // Fallback
  return {
    name: "Unknown",
    label: `UTC${formatOffset(offsetInSeconds)}`,
  };
}
