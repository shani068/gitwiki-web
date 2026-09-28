// Previous / next links in reading order, shown at the foot of each page
import Link from "next/link";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { wikiPath } from "@/constants/routes";
import type { WikiPageSummary } from "@/types/wiki";
import { cn } from "@/utils/cn";

interface PagePagerProps {
  owner:    string;
  repo:     string;
  previous: WikiPageSummary | null;
  next:     WikiPageSummary | null;
}

function PagerLink({
  href,
  label,
  title,
  direction,
}: {
  href:      string;
  label:     string;
  title:     string;
  direction: "previous" | "next";
}) {
  const Icon = direction === "previous" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-1 rounded-md border px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        direction === "next" && "items-end text-right sm:col-start-2"
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {direction === "previous" ? <Icon className="size-3.5" aria-hidden /> : null}
        {label}
        {direction === "next" ? <Icon className="size-3.5" aria-hidden /> : null}
      </span>
      <span className="font-medium group-hover:text-primary">{title}</span>
    </Link>
  );
}

export function PagePager({ owner, repo, previous, next }: PagePagerProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Pagination" className="mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2">
      {previous ? (
        <PagerLink
          href={wikiPath(owner, repo, previous.slug)}
          label="Previous"
          title={previous.title}
          direction="previous"
        />
      ) : null}
      {next ? (
        <PagerLink
          href={wikiPath(owner, repo, next.slug)}
          label="Next"
          title={next.title}
          direction="next"
        />
      ) : null}
    </nav>
  );
}
