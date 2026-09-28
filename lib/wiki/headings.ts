// Extracts h2/h3 headings from Markdown with the same slugs rehype-slug assigns
import GithubSlugger from "github-slugger";

import type { WikiHeading } from "@/types/wiki";

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const INLINE_MARKUP = /[`*_]|\[([^\]]*)\]\([^)]*\)/g;

export function extractHeadings(markdown: string): WikiHeading[] {
  const slugger = new GithubSlugger();
  const headings: WikiHeading[] = [];
  let isInFence = false;

  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) {
      isInFence = !isInFence;
      continue;
    }
    if (isInFence) continue;

    const match = HEADING.exec(line);
    if (!match) continue;

    const text = match[2].replace(INLINE_MARKUP, "$1");
    headings.push({ id: slugger.slug(text), text, depth: match[1].length === 2 ? 2 : 3 });
  }

  return headings;
}
