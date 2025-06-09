import { UnitType } from "@/types/unit";
import { WeatherTabType } from "@/types/weather-tabs";

export const units: { value: UnitType; label: string }[] = [
  { value: "metric", label: "Metric (°C)" },
  { value: "imperial", label: "Imperial (°F)" },
  { value: "standard", label: "Standard (K)" },
];

export const refreshRates = [
  { value: 5_000, label: "5 seconds" },
  { value: 10_000, label: "10 seconds" },
  { value: 30_000, label: "30 seconds" },
  { value: 60_000, label: "1 minute" },
  { value: 300_000, label: "5 minutes" },
  { value: 600_000, label: "10 minutes" },
  { value: 1_800_000, label: "30 minutes" },
  { value: 3_600_000, label: "1 hour" },
];

export const weatherTabs: {
  value: WeatherTabType;
  label: string;
  description: string;
}[] = [
  {
    value: "current_weather",
    label: "Current Weather",
    description: "Current weather conditions",
  },
  {
    value: "forecast",
    label: "Forecast",
    description: "Hourly weather forecast",
  },
  {
    value: "statistics",
    label: "Statistics",
    description: "Daily weather statistics",
  },
];
