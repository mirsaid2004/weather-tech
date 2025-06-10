import React from "react";
import dayjs from "dayjs";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Skeleton } from "../ui/skeleton";
import Fade from "../ui/fade";
import { Icon } from "@iconify/react/dist/iconify.js";
import { WeatherDataSchemaType } from "@/schemas/weather-data";
import { getTimeZoneInfo } from "@/helper/timezone";
import tzlookup from "tz-lookup";

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
          <h2 className="text-xl text-center font-bold">
            {data.data.city.name}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {data.data.city.country}
          </p>
          <span className="text-sm text-gray-500 text-center block mt-2">
            {
              getTimeZoneInfo(
                data.data.city.timezone,
                tzlookup(data.data.city.coord.lat, data.data.city.coord.lon),
              ).label
            }
          </span>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-2 col-span-2">
              <Icon icon="iconoir:position" width="24" height="24" />
              <span>{Object.values(data.data.city.coord).join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:sunrise-broken" width="24" height="24" />{" "}
              <span>
                {dayjs((data.data.city.sunrise || 0) * 1000).format("HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:sunset-broken" width="24" height="24" />
              <span>
                {dayjs((data.data.city.sunset || 0) * 1000).format("HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="formkit:people" width="24" height="24" />
              <span>{data.data.city.population}</span>
            </div>
          </div>
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
