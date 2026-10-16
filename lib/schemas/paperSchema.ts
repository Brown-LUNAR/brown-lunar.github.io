import { z } from "zod";

export const PaperSchema = z.object({
  id: z.string({ message: "Missing paper ID" }),

  title: z.string({ message: "Missing paper title" }),

  authors: z.array(
    z.string({ message: "Authors field must be an array of strings" }),
    { message: "Authors field must be an array" }
  ),

  year: z.coerce.number({ message: "Year must be a number" }).int(),

  // When the paper appeared, used to order papers within a year (newest first):
  // the conference's start date, the journal's publication date, or the arXiv v1
  // submission date for preprints. "YYYY-MM-DD", or "YYYY-MM" if only the month is known.
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "date must be YYYY-MM or YYYY-MM-DD"),

  venue: z.string({ message: "Missing paper venue" }),

  paperUrl: z.string().url({ message: "paperUrl must be a valid URL" }),
}).refine((p) => p.date.startsWith(String(p.year)), {
  message: "date must fall in the paper's year",
  path: ["date"],
});

export type Paper = z.infer<typeof PaperSchema>;