import { apiClient } from "@/api/requests";
import {
  CountriesDataType,
  InvalidCountriesSchemaType,
} from "@/schemas/countries";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

function useCitySelector() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["countries"],
        queryFn: () => apiClient.getCountries(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["countries-flag"],
        queryFn: () => apiClient.getCountriesFlag(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const countriesData = useMemo<
    CountriesDataType | InvalidCountriesSchemaType
  >(() => {
    if (!queries || !queries[0]?.data?.success || !queries[1]?.data?.success) {
      return { success: false, data: [], message: "Failed to fetch data" };
    }

    const flagsMap = queries[1].data.data.reduce(
      (acc, flag) => {
        acc[flag.iso2] = flag.flag;
        return acc;
      },
      {} as Record<string, string>,
    );

    const countriesWithFlags = queries[0].data.data.map((country) => {
      const flagData = flagsMap[country.iso2];
      return {
        ...country,
        flag: flagData,
      };
    });

    return {
      success: true,
      data: countriesWithFlags,
      message: "Countries fetched successfully",
    };
  }, [queries]);

  const fetchingCountries = useMemo(() => {
    return queries.some((query) => query.isLoading);
  }, [queries]);

  return { countriesData, fetchingCountries };
}

export default useCitySelector;
