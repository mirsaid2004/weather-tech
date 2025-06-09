import z from "zod";

export const countriesSchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      name: z.string(),
      iso2: z.string(),
      iso3: z.string(),
      states: z
        .array(
          z.object({
            name: z.string(),
            state_code: z.string().nullable(),
          }),
        )
        .optional()
        .default([]),
    }),
  ),
  message: z.string().optional(),
  code: z.number().optional(),
});

export const countryFlagSchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      name: z.string(),
      flag: z.string().url(),
      iso2: z.string(),
      iso3: z.string(),
    }),
  ),
  message: z.string().optional(),
  code: z.number().optional(),
});

export type CountriesSchemaType = z.infer<typeof countriesSchema>;
export type CountryFlagSchemaType = z.infer<typeof countryFlagSchema>;
export type CountriesDataType = {
  success: true;
  data: {
    name: string;
    flag: string;
    iso2: string;
    iso3: string;
    states: { name: string; state_code: string | null }[];
  }[];
  message?: string;
  code?: number;
};
export type InvalidCountriesSchemaType = {
  success: false;
  error?: string;
  message?: string;
  code?: number;
};
