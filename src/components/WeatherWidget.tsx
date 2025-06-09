import Navbar from "./ui/navbar";
import CitySelector from "./CitySelector";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { WeatherTabType } from "@/types/weather-tabs";
import WeatherDisplay from "./WeatherDisplay";
import ForecastList from "./ForecastList";
import DataVisualization from "./DataVisualization";
import Loop from "./ui/loop";
import { weatherTabs } from "@/constants/weather-contants";
import Fade from "./ui/fade";
import { Icon } from "@iconify/react/dist/iconify.js";

function WeatherWidget() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CitySelector />
      <WeatherInfoPart />
    </div>
  );
}

const WeatherInfoPart = () => {
  const { state } = useWeatherData();
  const filteredWeatherTabs = weatherTabs.filter((tab) =>
    state.weatherTabs.includes(tab.value as WeatherTabType),
  );
  const [weatherTab, setWeatherTab] = useState<WeatherTabType>(
    filteredWeatherTabs[0].value,
  );

  return state.city ? (
    <div className="w-full max-w-[800px] p-3 mx-auto">
      <Tabs
        value={weatherTab}
        onValueChange={(value) => setWeatherTab(value as WeatherTabType)}
        className=" mt-3"
      >
        <TabsList>
          <Loop
            withWrapper={false}
            list={filteredWeatherTabs}
            component={(tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="sm:text-sm text-xs"
              >
                {tab.label}
              </TabsTrigger>
            )}
          />
        </TabsList>
        <TabsContent value={"current_weather"}>
          <WeatherDisplay />
        </TabsContent>
        <TabsContent value={"forecast"}>
          <Fade>
            <ForecastList />
          </Fade>
        </TabsContent>
        <TabsContent value={"statistics"}>
          <Fade>
            <DataVisualization />
          </Fade>
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full max-w-[800px] p-3 mx-auto flex-1">
      <Icon
        icon="gis:search-country"
        width="200"
        height="200"
        className="text-gray-400"
      />
      <h2 className="text-gray-500 font-semibold text-xl mt-3 text-center">
        Search for a city to get weather information
      </h2>
    </div>
  );
};

export default WeatherWidget;
