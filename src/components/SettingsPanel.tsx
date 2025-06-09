import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/contexts/ThemeContext";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Loop from "./ui/loop";
import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherDataEnum } from "@/contexts/WeatherDataContext";
import { UnitType } from "@/types/unit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import clsx from "clsx";
import { ScrollArea } from "./ui/scroll-area";
import { refreshRates, units, weatherTabs } from "@/constants/weather-contants";

function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useWeatherData();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="size-10 rounded-full">
          <Icon icon="uil:setting" fontSize={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]">
        <ScrollArea className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Settings Panel</DialogTitle>
            <DialogDescription>
              Here you can adjust your preferences and settings.
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="w-full mt-3"
          >
            <TabsList className="w-full">
              <TabsTrigger value="light" className="sm:text-sm text-xs">
                Light Mode
              </TabsTrigger>
              <TabsTrigger value="dark" className="sm:text-sm text-xs">
                Dark Mode
              </TabsTrigger>
              <TabsTrigger value="system" className="sm:text-sm text-xs">
                System default
              </TabsTrigger>
            </TabsList>
            <TabsContent value="light" className="text-xs text-center mt-1">
              Light mode selected. Your interface will be bright and clear.
            </TabsContent>
            <TabsContent value="dark" className="text-xs text-center mt-1">
              Dark mode selected. Your interface will be dark and sleek.
            </TabsContent>
            <TabsContent value="system" className="text-xs text-center mt-1">
              System default selected. Your interface will adapt to your system
              settings.
            </TabsContent>
          </Tabs>
          <div className="mt-2">
            <div className="mb-2">Unit of Measurement</div>
            <RadioGroup
              value={state.unit}
              onValueChange={(value) => {
                dispatch({
                  type: WeatherDataEnum.TOGGLE_UNIT,
                  payload: { unit: value as UnitType },
                });
              }}
            >
              <Loop
                withWrapper={false}
                list={units}
                component={(unit) => (
                  <div className="flex items-center space-x-2" key={unit.value}>
                    <RadioGroupItem value={unit.value} id={unit.value} />
                    <Label htmlFor={unit.value}>{unit.label}</Label>
                  </div>
                )}
              />
            </RadioGroup>
          </div>
          <div className="mt-3">
            <div className="mb-2">
              <label htmlFor="refresh-rate">Refresh Rate</label>
            </div>
            <Select
              value={state.refreshRate.toString()}
              onValueChange={(value) => {
                dispatch({
                  type: WeatherDataEnum.CHANGE_REFRESH_RATE,
                  payload: { refreshRate: parseInt(value, 10) },
                });
              }}
            >
              <SelectTrigger id="refresh-rate" className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <Loop
                  withWrapper={false}
                  list={refreshRates}
                  component={(rate) => (
                    <SelectItem key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3">
            <div className="mb-2">Weather Tabs</div>
            <Loop
              className="grid sm:grid-cols-3 grid-cols-1 gap-3"
              list={weatherTabs}
              component={(weatherTab) => (
                <Label
                  key={weatherTab.value}
                  htmlFor={weatherTab.value}
                  className={clsx(
                    "flex-1 min-w-16",
                    "hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-primary dark:has-[[aria-checked=true]]:bg-primary/20",
                  )}
                >
                  <Checkbox
                    id={weatherTab.value}
                    checked={state.weatherTabs.includes(weatherTab.value)}
                    onCheckedChange={(checked) => {
                      console.log(
                        `Checkbox for ${weatherTab.label} is now ${checked}`,
                        checked
                          ? [...state.weatherTabs, weatherTab.value]
                          : state.weatherTabs.filter(
                              (tab) => tab !== weatherTab.value,
                            ),
                      );
                      dispatch({
                        type: WeatherDataEnum.CHANGE_WEATHER_TABS,
                        payload: {
                          weatherTabs: checked
                            ? [...state.weatherTabs, weatherTab.value]
                            : state.weatherTabs.filter(
                                (tab) => tab !== weatherTab.value,
                              ),
                        },
                      });
                    }}
                    className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-primary"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      {weatherTab.label}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {weatherTab.description}
                    </p>
                  </div>
                </Label>
              )}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsPanel;
