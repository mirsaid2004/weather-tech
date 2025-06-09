import {
  countriesSchema,
  CountriesSchemaType,
  countryFlagSchema,
  CountryFlagSchemaType,
  InvalidCountriesSchemaType,
} from "@/schemas/countries";
import { weatherDataSchema } from "@/schemas/weather-data";
import { UnitType } from "@/types/unit";

import axios from "axios";

class ApiClient {
  async getCountries() {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_COUNTRIES_API_URL}/countries/states`,
      );

      return countriesSchema.parse({
        success: true,
        data: result.data.data,
        message: result.data.data.msg,
        code: result.status,
      }) as CountriesSchemaType;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return {
        success: false,
        message: "Failed to fetch countries",
        code: 500,
      } as InvalidCountriesSchemaType;
    }
  }

  async getCountriesFlag() {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_COUNTRIES_API_URL}/countries/flag/images`,
      );

      return countryFlagSchema.parse({
        success: true,
        data: result.data.data,
        message: result.data.data.msg,
        code: result.status,
      }) as CountryFlagSchemaType;
    } catch (error) {
      console.error("Error fetching country flag:", error);
      return {
        success: false,
        message: "Failed to fetch country flag",
        code: 500,
      } as InvalidCountriesSchemaType;
    }
  }

  async getWeather(query: string, unit: UnitType) {
    const result = await axios.get(
      `${import.meta.env.VITE_OPEN_WEATHER_API_URL}/`,
      {
        params: {
          q: query,
          appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
          units: unit,
        },
      },
    );
    console.log({ result });
    return weatherDataSchema.parse({
      success: true,
      data: {
        city: result.data.city,
        cnt: result.data.cnt,
        list: result.data.list,
      },
      code: +result.data.cod,
      message: result.data.message || "",
    });
  }
}

export const apiClient = new ApiClient();
