import { z } from "zod";

export const MemberCategoryEnum = z.enum([
  "professor",
  "postdoc",
  "phd",
  "graduate",
  "undergraduate",
]);

export type MemberCategory = z.infer<typeof MemberCategoryEnum>;

export const MemberSchema = z.object({
  id: z.string().min(1, "Missing member id"),

  name: z.string().min(1, "Missing member name"),

  // Displayed under the name (e.g. "PhD Student").
  role: z.string().optional(),

  category: MemberCategoryEnum,

  // Path relative to public/images (e.g. "people/ellie-pavlick.png").
  // A placeholder circle is rendered when omitted or the file is missing.
  image: z.string().optional(),

  // Research interests / one-line bio.
  description: z.string().optional(),

  // Optional personal homepage. When set, the rendered name and image link to it.
  url: z.string().url("url must be a valid URL").optional(),

  // Within-category ordering. Lower numbers render first.
  order: z.number().optional(),
});

export type Member = z.infer<typeof MemberSchema>;
