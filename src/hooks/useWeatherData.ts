import { WeatherDataContext } from "@/contexts/WeatherDataContext";
import { useContext } from "react";

export function useWeatherData() {
  const context = useContext(WeatherDataContext);

  if (context === undefined) {
    throw new Error("useWeatherData must be used within a WeatherDataProvider");
  }

  return context;
}
