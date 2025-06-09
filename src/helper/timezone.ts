import timezones from "@/assets/data/timezones.json";
import { formatOffset } from "./offset-format";

export function getTimeZoneInfo(offsetInSeconds: number): {
  name: string;
  label: string;
} {
  const offsetMinutes = offsetInSeconds / 60;
  const offsetInHours = offsetMinutes / 60;

  for (const tz of timezones) {
    if (tz.offset === offsetInHours) {
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
