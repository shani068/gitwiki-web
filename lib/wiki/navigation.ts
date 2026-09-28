// Pure helpers for moving around a wiki's section/page tree
import type { WikiPageSummary, WikiSection } from "@/types/wiki";

export interface LocatedPage {
  page:    WikiPageSummary;
  section: WikiSection;
}

export function flattenPages(sections: WikiSection[]): LocatedPage[] {
  return sections.flatMap((section) => section.pages.map((page) => ({ page, section })));
}

// No slug means the wiki root, which shows the first page
export function resolveSlug(sections: WikiSection[], slugParts?: string[]): string | null {
  if (slugParts?.length) return slugParts.map(decodeURIComponent).join("/");
  return sections[0]?.pages[0]?.slug ?? null;
}

export function locatePage(sections: WikiSection[], slug: string) {
  const pages = flattenPages(sections);
  const index = pages.findIndex(({ page }) => page.slug === slug);
  if (index === -1) return null;

  return {
    current:  pages[index],
    previous: pages[index - 1]?.page ?? null,
    next:     pages[index + 1]?.page ?? null,
  };
}

export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}
