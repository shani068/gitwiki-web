// One repository in the library — the whole row opens the wiki once it's indexed
import Link from "next/link";

import { wikiPath } from "@/constants/routes";
import { shortSha } from "@/lib/wiki/navigation";
import type { WikiRepository } from "@/types/wiki";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/format-date";

import { IndexStatus } from "./index-status";

function RowMeta({ repository }: { repository: WikiRepository }) {
  if (repository.status === "failed") {
    return <p className="text-sm text-destructive">{repository.error}</p>;
  }
  if (repository.status === "indexing") {
    return <p className="text-sm text-muted-foreground">Reading files and writing pages…</p>;
  }
  return (
    <p className="flex flex-wrap gap-x-4 text-sm text-muted-foreground tabular-nums">
      <span>
        {repository.pageCount} {repository.pageCount === 1 ? "page" : "pages"}
      </span>
      {repository.commitSha ? (
        <span>
          from <span className="font-mono text-foreground">{shortSha(repository.commitSha)}</span>
        </span>
      ) : null}
      {repository.indexedAt ? <span>indexed {timeAgo(repository.indexedAt)}</span> : null}
    </p>
  );
}

export function RepositoryRow({ repository }: { repository: WikiRepository }) {
  const isReady = repository.status === "ready";
  const title = (
    <span className="font-mono text-[0.9375rem]">
      <span className="text-muted-foreground">{repository.owner}/</span>
      <span className={cn("font-medium", isReady && "group-hover:text-primary")}>
        {repository.name}
      </span>
    </span>
  );

  return (
    <li className="group relative grid gap-1.5 py-5 sm:grid-cols-[1fr_auto] sm:gap-x-8">
      <h3 className="min-w-0 sm:col-start-1 sm:row-start-1">
        {isReady ? (
          <Link
            href={wikiPath(repository.owner, repository.name)}
            className="rounded-sm after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <IndexStatus
        status={repository.status}
        className="sm:col-start-2 sm:row-start-1 sm:self-center sm:justify-self-end"
      />
      {repository.description ? (
        <p className="max-w-prose text-sm text-foreground/85 sm:col-span-2">{repository.description}</p>
      ) : null}
      <div className="sm:col-span-2">
        <RowMeta repository={repository} />
      </div>
    </li>
  );
}
