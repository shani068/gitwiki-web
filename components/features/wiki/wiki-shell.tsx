// Reader frame — header, persistent page tree, and search; pages render as children
"use client";

import { useParams } from "next/navigation";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWiki } from "@/hooks/useWiki";
import { resolveSlug } from "@/lib/wiki/navigation";

import { WikiHeader } from "./wiki-header";
import { WikiNav } from "./wiki-nav";
import { WikiSearch } from "./wiki-search";

interface WikiShellProps {
  owner:    string;
  repo:     string;
  children: React.ReactNode;
}

export function WikiShell({ owner, repo, children }: WikiShellProps) {
  const { slug } = useParams<{ slug?: string[] }>();
  const { data: wiki } = useWiki(owner, repo);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeSlug = wiki ? resolveSlug(wiki.sections, slug) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#wiki-content"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <WikiHeader
        owner={owner}
        repo={repo}
        repository={wiki?.repository}
        onOpenNav={() => setIsNavOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[90rem] flex-1">
        <aside className="hidden w-64 shrink-0 border-r lg:block">
          <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto px-4 py-8">
            <WikiNav owner={owner} repo={repo} sections={wiki?.sections} activeSlug={activeSlug} />
          </div>
        </aside>

        <main id="wiki-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-mono text-sm">
              {owner}/{repo}
            </SheetTitle>
            <SheetDescription className="sr-only">Pages in this wiki</SheetDescription>
          </SheetHeader>
          <div className="px-2 pb-6">
            <WikiNav
              owner={owner}
              repo={repo}
              sections={wiki?.sections}
              activeSlug={activeSlug}
              onNavigate={() => setIsNavOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <WikiSearch
        owner={owner}
        repo={repo}
        sections={wiki?.sections}
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </div>
  );
}
