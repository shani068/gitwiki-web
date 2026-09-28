// Command palette for jumping to any page or heading — opens with ⌘K / Ctrl K or "/"
"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { FileTextIcon, HashIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { wikiPath } from "@/constants/routes";
import { flattenPages } from "@/lib/wiki/navigation";
import type { WikiSection } from "@/types/wiki";

interface WikiSearchProps {
  owner:        string;
  repo:         string;
  sections:     WikiSection[] | undefined;
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function WikiSearch({ owner, repo, sections, open, onOpenChange }: WikiSearchProps) {
  const router = useRouter();
  const pages = flattenPages(sections ?? []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      const isSlash = event.key === "/" && !isTypingTarget(event.target);
      if (!isShortcut && !isSlash) return;

      event.preventDefault();
      onOpenChange(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Search ${owner}/${repo}`}
      description="Find a page or a section within a page"
    >
      <CommandInput placeholder={`Search ${repo}…`} />
      <CommandList>
        <CommandEmpty>No pages or sections match that search.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map(({ page, section }) => (
            <CommandItem
              key={page.slug}
              value={`page:${page.slug}`}
              keywords={[page.title, section.title, page.sourcePath]}
              onSelect={() => go(wikiPath(owner, repo, page.slug))}
            >
              <FileTextIcon />
              <span className="truncate">{page.title}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{section.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Sections">
          {pages.flatMap(({ page }) =>
            page.headings.map((heading) => (
              <CommandItem
                key={`${page.slug}#${heading.id}`}
                value={`heading:${page.slug}#${heading.id}`}
                keywords={[heading.text, page.title]}
                onSelect={() => go(`${wikiPath(owner, repo, page.slug)}#${heading.id}`)}
              >
                <HashIcon />
                <span className="truncate">{heading.text}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{page.title}</span>
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
