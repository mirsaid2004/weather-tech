import { useCallback, useMemo } from "react";
import AdvancedSearch from "../ui/advanced-search/AdvancedSearch";
import useCitySelector from "./hooks/useCitySelector";
import { CountriesDataType } from "@/schemas/countries";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherDataEnum } from "@/contexts/WeatherDataContext";
import { highlightMatch } from "@/helper/highlight";

function CitySelector() {
  const { state, dispatch } = useWeatherData();
  const { countriesData } = useCitySelector();
  const isContentElementsValid =
    countriesData?.success && countriesData?.data?.length;

  return (
    <div className="w-full flex flex-col dark:bg-slate-100/10 bg-slate-100 items-center justify-center gap-5 py-14 px-3 border-b border-gray-400">
      <h2 className="sm:text-2xl font-bold text-center text-xl">
        Search City to get weather info
      </h2>

      <AdvancedSearch.Root
        value={state.city}
        aria-invalid={state.error ? "true" : "false"}
        onValueChange={(value: string) =>
          dispatch({
            type: WeatherDataEnum.CHANGE_CITY,
            payload: { city: value },
          })
        }
        className="max-w-96"
      >
        <AdvancedSearch.Input
          placeholder="Search for a city..."
          className="w-full"
        />
        {isContentElementsValid ? (
          <CitySearchPart countriesData={countriesData} />
        ) : (
          <AdvancedSearch.EmptyMessage>
            <Icon icon="ph:empty-bold" fontSize={40} />
            <h1 className="text-lg font-semibold">Countries Not Found</h1>
          </AdvancedSearch.EmptyMessage>
        )}
      </AdvancedSearch.Root>
    </div>
  );
}

const CitySearchPart = ({
  countriesData,
}: {
  countriesData: CountriesDataType;
}) => {
  const { state, dispatch } = useWeatherData();
  const query = state.city.toLowerCase().trim();

  const groupFilteredData = useMemo(() => {
    const filteredCountries = countriesData.data
      .map((country) => {
        const states = (country.states || []).filter((city) =>
          city.name.toLowerCase().includes(query),
        );

        return {
          ...country,
          states: states.length > 0 ? states : [],
        };
      })
      .filter(
        (country) =>
          country.states.length || country.name.toLowerCase().includes(query),
      );

    return {
      data: {
        countries: filteredCountries.map((country) => ({
          name: country.name,
          flag: country.flag,
          iso2: country.iso2,
          iso3: country.iso3,
        })),
        states: filteredCountries.flatMap((country) =>
          country.states.map((state) => ({
            name: state.name,
            state_code: state.state_code,
            countryIso2: country.iso2,
          })),
        ),
      },
      groupCounts: filteredCountries.map((country) => country.states.length),
    };
  }, [countriesData, query]);

  // const filteredGroupData = useMemo(() => {
  //   const filteredCountries: typeof countriesData.data = [];

  //   // 1. Match states first
  //   const matchedStates = countriesData.data.flatMap((country) => {
  //     const states = (country.states || []).filter((state) =>
  //       state.name.toLowerCase().includes(state.name.toLowerCase()),
  //     );

  //     return states.length > 0 ? [{ ...country, states }] : [];
  //   });

  //   if (matchedStates.length > 0) {
  //     // Add countries that have matched states only
  //     filteredCountries.push(...matchedStates);
  //   } else {
  //     // 2. Fallback to country name match
  //     countriesData.data.forEach((country) => {
  //       if (country.name.toLowerCase().includes(state.city.toLowerCase())) {
  //         filteredCountries.push({ ...country, states: [] });
  //       }
  //     });
  //   }

  //   // Build final group data and groupCounts
  //   const result = {
  //     countries: [] as {
  //       name: string;
  //       flag: string;
  //       iso2: string;
  //       iso3: string;
  //     }[],
  //     states: [] as {
  //       name: string;
  //       state_code: string | null;
  //       countryIso2: string;
  //     }[],
  //   };

  //   const groupCounts: number[] = [];

  //   filteredCountries.forEach((country) => {
  //     result.countries.push({
  //       name: country.name,
  //       flag: country.flag,
  //       iso2: country.iso2,
  //       iso3: country.iso3,
  //     });

  //     const countryStates = (country.states || []).map((state) => ({
  //       name: state.name,
  //       state_code: state.state_code,
  //       countryIso2: country.iso2,
  //     }));

  //     result.states.push(...countryStates);
  //     groupCounts.push(countryStates.length);
  //   });

  //   return {
  //     data: result,
  //     groupCounts,
  //   };
  // }, [countriesData, state.city]);

  const groupContent = useCallback(
    (index: number) => {
      const country = groupFilteredData.data.countries[index];

      return (
        <div
          className="px-4 py-2 flex items-center gap-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-[4px] shadow-md cursor-pointer"
          onClick={() =>
            dispatch({
              type: WeatherDataEnum.CHANGE_CITY,
              payload: { city: country.name },
            })
          }
        >
          <img src={country.flag} alt={country.iso2} className="h-4 w-auto" />{" "}
          <h3 className="">{highlightMatch(country.name, query)}</h3>
        </div>
      );
    },
    [dispatch, groupFilteredData.data.countries, query],
  );

  const itemContent = useCallback(
    (index: number) => {
      const state = groupFilteredData.data.states[index];
      return (
        <div
          className="px-4 py-2 my-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-[4px] shadow-sm cursor-pointer"
          onClick={() =>
            dispatch({
              type: WeatherDataEnum.CHANGE_CITY,
              payload: { city: state.name },
            })
          }
        >
          <p className="text-sm">{highlightMatch(state?.name, query)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {state?.state_code}
          </p>
        </div>
      );
    },
    [dispatch, groupFilteredData.data.states, query],
  );

  return (
    <AdvancedSearch.GroupedContent
      groupCounts={groupFilteredData.groupCounts}
      groupContent={groupContent}
      itemContent={itemContent}
    />
  );
};

export default CitySelector;
