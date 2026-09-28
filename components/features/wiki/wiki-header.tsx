// Reader top bar — product mark, repository identity, search, and theme
"use client";

import Link from "next/link";

import { ExternalLinkIcon, GitBranchIcon, MenuIcon, SearchIcon } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_NAME } from "@/constants/config";
import { ROUTES, wikiPath } from "@/constants/routes";
import type { WikiRepository } from "@/types/wiki";

interface WikiHeaderProps {
  owner:        string;
  repo:         string;
  repository:   WikiRepository | undefined;
  onOpenNav:    () => void;
  onOpenSearch: () => void;
}

export function WikiHeader({ owner, repo, repository, onOpenNav, onOpenSearch }: WikiHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="flex h-14 items-center gap-2 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenNav}
          aria-label="Open page list"
        >
          <MenuIcon />
        </Button>

        <Link
          href={ROUTES.WIKIS}
          className="hidden rounded-sm text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:block"
        >
          {APP_NAME}
        </Link>
        <span aria-hidden className="hidden text-border sm:block">
          /
        </span>

        <Link
          href={wikiPath(owner, repo)}
          className="min-w-0 truncate rounded-sm font-mono text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="text-muted-foreground">{owner}/</span>
          <span className="font-medium">{repo}</span>
        </Link>

        {repository ? (
          <span className="hidden items-center gap-1 font-mono text-xs text-muted-foreground md:inline-flex">
            <GitBranchIcon className="size-3.5" aria-hidden />
            {repository.defaultBranch}
          </span>
        ) : null}

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            onClick={onOpenSearch}
            className="w-9 justify-center px-0 text-muted-foreground sm:w-56 sm:justify-start sm:px-2.5"
            aria-label="Search this wiki"
          >
            <SearchIcon data-icon="inline-start" />
            <span className="hidden sm:inline">Search pages</span>
            <KbdGroup className="ml-auto hidden sm:inline-flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open repository on GitHub"
                >
                  <ExternalLinkIcon />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open on GitHub</TooltipContent>
          </Tooltip>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
