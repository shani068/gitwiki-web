// Page tree — sections mirror the repository layout, drawn with tree guide lines
"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { wikiPath } from "@/constants/routes";
import type { WikiSection } from "@/types/wiki";
import { cn } from "@/utils/cn";

interface WikiNavProps {
  owner:       string;
  repo:        string;
  sections:    WikiSection[] | undefined;
  activeSlug:  string | null;
  onNavigate?: () => void;
}

const SKELETON_ROWS = ["w-3/5", "w-4/5", "w-2/3", "w-1/2", "w-3/4"];

export function WikiNav({ owner, repo, sections, activeSlug, onNavigate }: WikiNavProps) {
  if (!sections) {
    return (
      <div className="flex flex-col gap-3 px-2" aria-busy aria-label="Loading pages">
        {SKELETON_ROWS.map((width) => (
          <Skeleton key={width} className={cn("h-4", width)} />
        ))}
      </div>
    );
  }

  if (sections.length === 0) {
    return <p className="px-2 text-sm text-muted-foreground">This wiki has no pages yet.</p>;
  }

  return (
    <nav aria-label="Wiki pages" className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.id}>
          <h2 className="px-2 pb-2 text-[0.8125rem] font-semibold text-foreground">
            {section.title}
          </h2>
          <ul className="ml-2 border-l border-border">
            {section.pages.map((page) => {
              const isActive = page.slug === activeSlug;
              return (
                <li key={page.slug}>
                  <Link
                    href={wikiPath(owner, repo, page.slug)}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "-ml-px flex min-h-8 items-center border-l py-1 pr-2 pl-3.5 text-sm transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isActive
                        ? "border-primary font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
