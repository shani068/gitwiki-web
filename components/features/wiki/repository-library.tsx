// Library of indexed repositories — filter, add, and open a wiki
"use client";

import { useDeferredValue, useState } from "react";

import { FolderGit2Icon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositories } from "@/hooks/useWiki";
import type { WikiRepository } from "@/types/wiki";
import { resolveError } from "@/utils/resolve-error";

import { AddRepositoryDialog } from "./add-repository-dialog";
import { LoadError } from "./article-states";
import { RepositoryRow } from "./repository-row";

function matchesQuery(repository: WikiRepository, query: string): boolean {
  const haystack = `${repository.owner}/${repository.name} ${repository.description}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function LibrarySkeleton() {
  return (
    <ul aria-busy aria-label="Loading repositories" className="divide-y">
      {["a", "b", "c"].map((key) => (
        <li key={key} className="flex flex-col gap-2 py-5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-40" />
        </li>
      ))}
    </ul>
  );
}

export function RepositoryLibrary() {
  const { data: repositories, error, isPending, refetch } = useRepositories();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const visible = repositories?.filter((repository) => matchesQuery(repository, deferredQuery));

  function renderList() {
    if (isPending) return <LibrarySkeleton />;
    if (error) {
      return (
        <LoadError
          title="Repositories didn’t load"
          message={resolveError(error)}
          onRetry={() => void refetch()}
        />
      );
    }

    if (repositories.length === 0) {
      return (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderGit2Icon />
            </EmptyMedia>
            <EmptyTitle>No repositories yet</EmptyTitle>
            <EmptyDescription>
              Add a GitHub repository and GitWiki will write a wiki from its code and docs.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddRepositoryDialog />
          </EmptyContent>
        </Empty>
      );
    }

    if (!visible?.length) {
      return (
        <div className="flex flex-col items-start gap-3 py-10">
          <p className="text-sm text-muted-foreground">
            No repository matches <span className="font-mono text-foreground">{deferredQuery}</span>.
          </p>
          <Button variant="outline" size="sm" onClick={() => setQuery("")}>
            Clear filter
          </Button>
        </div>
      );
    }

    return (
      <ul className="divide-y border-y">
        {visible.map((repository) => (
          <RepositoryRow key={`${repository.owner}/${repository.name}`} repository={repository} />
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby="library-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 id="library-heading" className="text-3xl font-semibold tracking-tight">
            Repositories
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Each wiki is written from a repository&apos;s default branch and stays in step with its
            latest commit.
          </p>
        </div>
        <AddRepositoryDialog />
      </div>

      {repositories && repositories.length > 0 ? (
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter repositories"
            aria-label="Filter repositories"
          />
        </InputGroup>
      ) : null}

      {renderList()}
    </section>
  );
}
