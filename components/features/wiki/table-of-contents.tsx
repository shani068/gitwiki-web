// "On this page" outline — highlights the section currently being read
"use client";

import { useEffect, useState } from "react";

import type { WikiHeading } from "@/types/wiki";
import { cn } from "@/utils/cn";

// A heading counts as "being read" once it crosses the top fifth of the viewport
const READING_LINE = "-80px 0px -80% 0px";

function useActiveHeading(headings: WikiHeading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: READING_LINE }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

export function TableOfContents({ headings }: { headings: WikiHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <nav aria-labelledby="toc-heading" className="text-sm">
      <h2 id="toc-heading" className="pb-3 font-semibold">
        On this page
      </h2>
      <ul className="flex flex-col border-l">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={heading.id === activeId ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1 pr-2 leading-snug transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                heading.depth === 3 ? "pl-6" : "pl-3",
                heading.id === activeId
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
