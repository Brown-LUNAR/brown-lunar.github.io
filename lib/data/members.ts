import "server-only";

import fs from "fs";
import path from "path";
import {
  MemberSchema,
  type Member,
  type MemberCategory,
} from "@/lib/schemas/memberSchema";

const MEMBERS_DIRECTORY = path.join(process.cwd(), "content", "members");
const PUBLIC_IMAGES_DIRECTORY = path.join(process.cwd(), "public", "images");

const CATEGORY_PRIORITY: Record<MemberCategory, number> = {
  professor: 0,
  postdoc: 1,
  phd: 2,
  graduate: 3,
  undergraduate: 4,
};

function getMemberFileNames(): string[] {
  if (!fs.existsSync(MEMBERS_DIRECTORY)) {
    console.warn(`Members directory does not exist: ${MEMBERS_DIRECTORY}`);
    return [];
  }

  return fs.readdirSync(MEMBERS_DIRECTORY).filter((file) => file.endsWith(".json"));
}

function resolveImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  if (fs.existsSync(path.join(PUBLIC_IMAGES_DIRECTORY, image))) return `/images/${image}`;
  console.warn(`Member image not found: public/images/${image}; rendering placeholder`);
  return undefined;
}

function readMemberFile(fileName: string): Member | null {
  const fullPath = path.join(MEMBERS_DIRECTORY, fileName);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const jsonData = JSON.parse(fileContents);
    const result = MemberSchema.safeParse(jsonData);

    if (!result.success) {
      console.warn(`Invalid member file skipped: ${fileName}`);
      console.warn(result.error.format());
      return null;
    }

    return { ...result.data, image: resolveImage(result.data.image) };
  } catch (error) {
    console.warn(`Failed to read or parse member file: ${fileName}`);
    console.warn(error);
    return null;
  }
}

function compareMembers(a: Member, b: Member): number {
  const cat = CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category];
  if (cat !== 0) return cat;

  const aOrder = a.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.order ?? Number.POSITIVE_INFINITY;
  if (aOrder !== bOrder) return aOrder - bOrder;

  return a.name.localeCompare(b.name);
}

/** Returns all valid members ordered by category, then by `order`, then by name. */
export function getAllMembers(): Member[] {
  const fileNames = getMemberFileNames();
  const items: Member[] = [];

  for (const fileName of fileNames) {
    const item = readMemberFile(fileName);
    if (item) items.push(item);
  }

  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) {
      console.warn(`Duplicate member id found: ${item.id}`);
    }
    seenIds.add(item.id);
  }

  return items.sort(compareMembers);
}
