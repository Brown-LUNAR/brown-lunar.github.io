import fs from "fs";
import path from "path";
import { PaperSchema, type Paper } from "@/lib/schemas/paperSchema";

const papersDirectory = path.join(process.cwd(), "content/papers");

function getPaperFileNames(): string[] {
  if (!fs.existsSync(papersDirectory)) {
    console.warn(`Papers directory does not exist: ${papersDirectory}`);
    return [];
  }

  return fs.readdirSync(papersDirectory).filter((fileName) => fileName.endsWith(".json"));
}

function readPaperFile(fileName: string): Paper | null {
  const fullPath = path.join(papersDirectory, fileName);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const jsonData = JSON.parse(fileContents);

    const result = PaperSchema.safeParse(jsonData);

    if (!result.success) {
      console.error(`Invalid paper JSON: ${fileName}`);
      console.error(result.error.format());
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Failed to read or parse paper file: ${fileName}`);
    console.error(error);
    return null;
  }
}

/** Returns all valid papers, newest first (by year, then date). Invalid files and duplicate ids are skipped with a warning. */
export function getAllPapers(): Paper[] {
  const fileNames = getPaperFileNames();
  const papers: Paper[] = [];
  const seenIds = new Set<string>();

  for (const fileName of fileNames) {
    const paper = readPaperFile(fileName);

    if (paper) {
      if (seenIds.has(paper.id)) {
        console.warn(`Duplicate paper ID found: ${paper.id} in ${fileName}`);
        continue;
      }
      seenIds.add(paper.id);
      papers.push(paper);
    }
  }

  return papers.sort((a, b) => b.year - a.year || b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
