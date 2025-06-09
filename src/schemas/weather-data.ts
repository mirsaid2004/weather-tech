import z from "zod";

export const weatherDataSchema = z.object({
  success: z.literal(true),
  data: z.object({
    cnt: z.number(),
    list: z.array(
      z.object({
        dt: z.number(),
        main: z.object({
          temp: z.number(),
          feels_like: z.number(),
          temp_min: z.number(),
          temp_max: z.number(),
          pressure: z.number(),
          sea_level: z.number().optional(),
          grnd_level: z.number().optional(),
          humidity: z.number(),
          temp_kf: z.number().optional(),
        }),
        weather: z.array(
          z.object({
            id: z.number(),
            main: z.string(),
            description: z.string(),
            icon: z.string(),
          }),
        ),
        clouds: z.object({
          all: z.number(),
        }),
        wind: z.object({
          speed: z.number(),
          deg: z.number().optional(),
          gust: z.number().optional(),
        }),
        visibility: z.number().optional(),
        pop: z.number().optional(),
        rain: z
          .object({
            "3h": z.number().optional(),
          })
          .optional(),
        sys: z.object({
          pod: z.string(), // 'd' or 'n'
        }),
        dt_txt: z.string(), // DateTime string
      }),
    ),
    city: z.object({
      id: z.number(),
      name: z.string(),
      coord: z.object({
        lat: z.number(),
        lon: z.number(),
      }),
      country: z.string(),
      population: z.number().optional(),
      timezone: z.number().optional(),
      sunrise: z.number().optional(),
      sunset: z.number().optional(),
    }),
  }),
  message: z.string().optional(),
  code: z.number().optional(),
});

export const weatherDataErrorSchema = z.object({
  success: z.literal(false),
  message: z.string().optional(),
  code: z.number().optional(),
});

export type WeatherDataSchemaType = z.infer<typeof weatherDataSchema>;
export type WeatherDataErrorSchemaType = z.infer<typeof weatherDataErrorSchema>;
