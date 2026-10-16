import { z } from "zod";

export const AlumnusSchema = z.object({
  id: z.string().min(1, "Missing alumnus id"),

  name: z.string().min(1, "Missing alumnus name"),

  // Original position in the lab (e.g. "Ph.D. Student", "MS Student",
  // "Undergraduate").
  role: z.string().min(1, "Missing alumnus role"),

  // Dissertation title, for PhD alumni who defended.
  dissertation: z.string().optional(),

  // Current job / current affiliation.
  nextPosition: z.string().optional(),

  // Optional personal homepage.
  url: z.string().url("url must be a valid URL").optional(),

  // Visual ordering within the alumni list.
  order: z.number().optional(),
});

export type Alumnus = z.infer<typeof AlumnusSchema>;
