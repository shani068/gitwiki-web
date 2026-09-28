// Page title block — breadcrumbs, title, and the page's provenance in the repository
import Link from "next/link";

import { FileCodeIcon, GitCommitHorizontalIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { wikiPath } from "@/constants/routes";
import { shortSha } from "@/lib/wiki/navigation";
import type { WikiPage, WikiRepository, WikiSection } from "@/types/wiki";
import { formatDate } from "@/utils/format-date";

interface ArticleHeaderProps {
  repository: WikiRepository;
  section:    WikiSection;
  page:       WikiPage;
}

export function ArticleHeader({ repository, section, page }: ArticleHeaderProps) {
  const { owner, name, defaultBranch } = repository;
  const githubBase = `https://github.com/${owner}/${name}`;

  return (
    <header className="flex flex-col gap-4 pb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={wikiPath(owner, name)} className="font-mono">
                {name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{section.title}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{page.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-[2.125rem]">
        {page.title}
      </h1>

      <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          <dt className="sr-only">Source file</dt>
          <FileCodeIcon className="size-3.5 shrink-0" aria-hidden />
          <dd className="min-w-0">
            <a
              href={`${githubBase}/blob/${defaultBranch}/${page.sourcePath}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono break-all hover:text-foreground hover:underline"
            >
              {page.sourcePath}
            </a>
          </dd>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <dt className="sr-only">Last commit</dt>
          <GitCommitHorizontalIcon className="size-3.5 shrink-0" aria-hidden />
          <dd className="flex min-w-0 items-center gap-1.5">
            <a
              href={`${githubBase}/commit/${page.commitSha}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-foreground hover:underline"
            >
              {shortSha(page.commitSha)}
            </a>
            <span className="truncate" title={page.commitMessage}>
              {page.commitMessage}
            </span>
          </dd>
        </div>
        <div>
          <dt className="sr-only">Updated</dt>
          <dd>
            <time dateTime={page.updatedAt}>Updated {formatDate(page.updatedAt)}</time>
          </dd>
        </div>
      </dl>
    </header>
  );
}
