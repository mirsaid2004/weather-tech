import React from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Skeleton } from "../ui/skeleton";
import Fade from "../ui/fade";
import { Icon } from "@iconify/react/dist/iconify.js";
import { WeatherDataSchemaType } from "@/schemas/weather-data";

function WeatherDisplay() {
  const { state } = useWeatherData();
  return state.loading ? (
    <WeatherDisplayLoading />
  ) : state.weatherData?.success ? (
    <WeatherDisplayContent data={state.weatherData} />
  ) : (
    <WeatherDisplayError />
  );
}

const WeatherDisplayContent = ({ data }: { data: WeatherDataSchemaType }) => {
  const { state } = useWeatherData();
  return (
    <Fade>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mt-2">
        <div className="sm:col-span-1 dark:bg-slate-100/10 bg-slate-100 p-3 rounded-lg min-h-36 border border-gray-400">
          <h2 className="text-xl font-bold">{data.data.city.name}</h2>
          <p className="text-sm text-gray-500">{data.data.city.country}</p>
          <Icon icon="solar:sunrise-broken" width="24" height="24" />
          <Icon icon="solar:sunset-broken" width="24" height="24" />
        </div>
        <div className="sm:col-span-2 dark:bg-slate-100/10 bg-slate-100 p-3 rounded-lg min-h-36 border border-gray-400">
          <p className="text-2xl font-semibold">
            {10}°{state.unit === "metric" ? "C" : "F"}
          </p>
          <p className="text-sm text-gray-500">
            {data.data.list[0].weather[0].description}
          </p>
        </div>
        <div className="sm:col-span-3 dark:bg-slate-100/10 bg-slate-100 p-3 rounded-lg min-h-36 border border-gray-400">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas dolores
          sapiente voluptas? Placeat eius suscipit consequatur? Ab veniam
          temporibus aliquam, dolorem hic doloremque voluptatum inventore
          perferendis sit cupiditate totam odit.
        </div>
      </div>
    </Fade>
  );
};

const WeatherDisplayLoading = () => (
  <Fade>
    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mt-2">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full sm:col-span-2" />
      <Skeleton className="h-36 w-full sm:col-span-3" />
    </div>
  </Fade>
);

const WeatherDisplayError = () => (
  <Fade>
    <div className="flex flex-col gap-3 items-center justify-center mt-4">
      <Icon
        icon="material-symbols:error-outline"
        width="200"
        height="200"
        className="text-red-600"
      />
      <p className="text-center text-red-600">
        Error loading weather data. Please try again later.
      </p>
    </div>
  </Fade>
);

export default WeatherDisplay;
