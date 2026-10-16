/**
 * Validates every content JSON file against its schema and exits non-zero on
 * failure. The site build only warns and skips bad files, so run this before
 * pushing: `npm run validate`.
 */

import fs from "fs";
import path from "path";
import { PaperSchema } from "../lib/schemas/paperSchema";
import { MemberSchema } from "../lib/schemas/memberSchema";
import { AlumnusSchema } from "../lib/schemas/alumnusSchema";
import { ZodSchema } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const CONTENT_TYPES = [
  {
    name: "papers",
    dir: path.join(CONTENT_ROOT, "papers"),
    schema: PaperSchema,
  },
  {
    name: "members",
    dir: path.join(CONTENT_ROOT, "members"),
    schema: MemberSchema,
  },
  {
    name: "alumni",
    dir: path.join(CONTENT_ROOT, "alumni"),
    schema: AlumnusSchema,
  },
];

function validateDirectory(name: string, dir: string, schema: ZodSchema): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  if (!fs.existsSync(dir)) {
    console.warn(`  [SKIP] Directory not found: ${dir}`);
    return { passed, failed };
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(dir, file);

    let json: unknown;
    try {
      json = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    } catch {
      console.error(`  [FAIL] ${file} — invalid JSON`);
      failed++;
      continue;
    }

    const result = schema.safeParse(json);
    if (result.success) {
      console.log(`  [OK]   ${file}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${file}`);
      const errors = result.error.flatten();
      for (const [field, messages] of Object.entries(errors.fieldErrors)) {
        console.error(`         ${field}: ${(messages as string[]).join(", ")}`);
      }
      failed++;
    }
  }

  return { passed, failed };
}

let totalPassed = 0;
let totalFailed = 0;

for (const { name, dir, schema } of CONTENT_TYPES) {
  console.log(`\nValidating ${name}...`);
  const { passed, failed } = validateDirectory(name, dir, schema);
  totalPassed += passed;
  totalFailed += failed;
}

console.log(`\n──────────────────────────`);
console.log(`Passed: ${totalPassed}  Failed: ${totalFailed}`);

if (totalFailed > 0) {
  console.error(`\nContent validation failed. Fix the errors above.`);
  process.exit(1);
} else {
  console.log(`\nAll content valid.`);
}
