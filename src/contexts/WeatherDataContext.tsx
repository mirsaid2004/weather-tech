/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { apiClient } from "@/api/requests";
import { useDebounce } from "@/hooks/useDebounce";
import { WeatherDataSchemaType } from "@/schemas/weather-data";
import { UnitType } from "@/types/unit";
import { throttle } from "@/utils/throttle";
import { toast } from "sonner";
import { WeatherTabType } from "@/types/weather-tabs";

export type WeatherDataContextType = {
  state: WeatherDataType;
  dispatch: React.Dispatch<WeatherDataActionType>;
};

export type WeatherDataType = {
  city: string;
  unit: UnitType;
  weatherTabs: WeatherTabType[];
  weatherData: WeatherDataSchemaType | null;
  loading: boolean;
  error?: string;
  refreshRate: number; // in seconds
};

export enum WeatherDataEnum {
  FETCH_WEATHER = "FETCH_WEATHER",
  FETCH_WEATHER_SUCCESS = "FETCH_WEATHER_SUCCESS",
  CHANGE_CITY = "CHANGE_CITY",
  CHANGE_REFRESH_RATE = "CHANGE_REFRESH_RATE",
  CHANGE_WEATHER_TABS = "CHANGE_WEATHER_TABS",
  TOGGLE_UNIT = "TOGGLE_UNIT",
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
}

type WeatherDataActionType =
  | {
      type: WeatherDataEnum.CHANGE_CITY;
      payload: { city: string };
    }
  | {
      type: WeatherDataEnum.TOGGLE_UNIT;
      payload: { unit: "metric" | "imperial" | "standard" };
    }
  | {
      type: WeatherDataEnum.CHANGE_REFRESH_RATE;
      payload: { refreshRate: number };
    }
  | {
      type: WeatherDataEnum.CHANGE_WEATHER_TABS;
      payload: { weatherTabs: WeatherTabType[] };
    }
  | {
      type: WeatherDataEnum.FETCH_WEATHER;
    }
  | {
      type: WeatherDataEnum.FETCH_WEATHER_SUCCESS;
      payload: { weatherData: WeatherDataSchemaType };
    }
  | {
      type: WeatherDataEnum.SET_ERROR;
      payload: { message: string };
    }
  | {
      type: WeatherDataEnum.CLEAR_ERROR;
    };

function weatherDataReducer(
  state: WeatherDataType,
  action: WeatherDataActionType,
): WeatherDataType {
  switch (action.type) {
    case WeatherDataEnum.CHANGE_CITY:
      return {
        ...state,
        city: action.payload.city,
        loading: true,
        error: undefined,
      };
    case WeatherDataEnum.TOGGLE_UNIT:
      return {
        ...state,
        unit: action.payload.unit,
      };
    case WeatherDataEnum.CHANGE_REFRESH_RATE:
      return {
        ...state,
        refreshRate: action.payload.refreshRate,
      };
    case WeatherDataEnum.CHANGE_WEATHER_TABS:
      return {
        ...state,
        weatherTabs: action.payload.weatherTabs,
      };
    case WeatherDataEnum.FETCH_WEATHER:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case WeatherDataEnum.FETCH_WEATHER_SUCCESS:
      return {
        ...state,
        weatherData: action.payload.weatherData,
        loading: false,
      };
    case WeatherDataEnum.SET_ERROR: {
      toast.error(action.payload.message, {
        description: "Please try again later.",
        position: "top-right",
      });
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    }
    case WeatherDataEnum.CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        weatherData: null,
        error: undefined,
      };
    default:
      return state;
  }
}

const initialState: WeatherDataType = {
  city: "",
  unit: "standard", // default unit
  weatherData: null,
  weatherTabs: ["current_weather", "forecast", "statistics"], // default tabs
  loading: false,
  error: undefined,
  refreshRate: 60 * 5 * 1000, // 5 minutes in milliseconds
};

export const WeatherDataContext = createContext<
  WeatherDataContextType | undefined
>(undefined);

export function WeatherDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(weatherDataReducer, initialState);

  const bouncedQuery = useDebounce(state.city, 300);

  const fetchData = async (
    city: string,
    unit: "metric" | "imperial" | "standard",
  ) => {
    try {
      // Simulate an API call
      const response = await apiClient.getWeather(city, unit);

      if (!response || !response.data) {
        throw new Error("No data received from the weather API");
      }

      dispatch({
        type: WeatherDataEnum.FETCH_WEATHER_SUCCESS,
        payload: { weatherData: response },
      });
    } catch (error: any) {
      dispatch({
        type: WeatherDataEnum.SET_ERROR,
        payload: { message: error.message || "Failed to fetch weather data" },
      });
    }
  };

  const getWeatherThrottled = useRef(throttle(fetchData, 5000));

  const triggerWeatherFetch = useCallback(
    (bouncedQuery: string, unit: UnitType) => {
      dispatch({ type: WeatherDataEnum.FETCH_WEATHER });
      getWeatherThrottled.current(bouncedQuery, unit);
    },
    [dispatch],
  );

  console.log({ state });

  useEffect(() => {
    if (bouncedQuery && state.unit) {
      triggerWeatherFetch(bouncedQuery, state.unit);
    }

    if (!bouncedQuery) {
      dispatch({ type: WeatherDataEnum.CLEAR_ERROR });
      getWeatherThrottled.current.cancel();
    }
  }, [bouncedQuery, state.unit, triggerWeatherFetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bouncedQuery && state.unit) {
        triggerWeatherFetch(bouncedQuery, state.unit);
      }
    }, state.refreshRate);

    return () => clearInterval(interval);
  }, [bouncedQuery, state.unit, state.refreshRate, triggerWeatherFetch]);

  return (
    <WeatherDataContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherDataContext.Provider>
  );
}
