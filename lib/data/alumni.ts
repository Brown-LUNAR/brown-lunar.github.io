import "server-only";

import fs from "fs";
import path from "path";
import { AlumnusSchema, type Alumnus } from "@/lib/schemas/alumnusSchema";

const ALUMNI_DIRECTORY = path.join(process.cwd(), "content", "alumni");

function getAlumniFileNames(): string[] {
  if (!fs.existsSync(ALUMNI_DIRECTORY)) {
    console.warn(`Alumni directory does not exist: ${ALUMNI_DIRECTORY}`);
    return [];
  }

  return fs.readdirSync(ALUMNI_DIRECTORY).filter((file) => file.endsWith(".json"));
}

function readAlumnusFile(fileName: string): Alumnus | null {
  const fullPath = path.join(ALUMNI_DIRECTORY, fileName);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    const result = AlumnusSchema.safeParse(jsonData);

    if (!result.success) {
      console.warn(`Invalid alumnus file skipped: ${fileName}`);
      console.warn(result.error.format());
      return null;
    }

    return result.data;
  } catch (error) {
    console.warn(`Failed to read or parse alumnus file: ${fileName}`);
    console.warn(error);
    return null;
  }
}

/**
 * Returns all valid alumni sorted by `order`, then by name.
 */
export function getAllAlumni(): Alumnus[] {
  const fileNames = getAlumniFileNames();
  const items: Alumnus[] = [];

  for (const fileName of fileNames) {
    const item = readAlumnusFile(fileName);
    if (item) items.push(item);
  }

  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) {
      console.warn(`Duplicate alumnus id found: ${item.id}`);
    }
    seenIds.add(item.id);
  }

  return items.sort((a, b) => {
    const aOrder = a.order ?? Number.POSITIVE_INFINITY;
    const bOrder = b.order ?? Number.POSITIVE_INFINITY;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });
}
