// One wiki page — resolves the slug against the page tree, then loads and renders it
"use client";

import { useEffect } from "react";

import { useWiki, useWikiPage } from "@/hooks/useWiki";
import { isNotFoundError } from "@/lib/wiki/errors";
import { locatePage, resolveSlug } from "@/lib/wiki/navigation";
import { resolveError } from "@/utils/resolve-error";

import { ArticleHeader } from "./article-header";
import {
  LoadError,
  ArticleSkeleton,
  PageNotFound,
  RepositoryNotFound,
  WikiIndexFailed,
  WikiIndexing,
} from "./article-states";
import { MarkdownContent } from "./markdown-content";
import { PagePager } from "./page-pager";
import { TableOfContents } from "./table-of-contents";

interface WikiArticleProps {
  owner:      string;
  repo:       string;
  slugParts?: string[];
}

export function WikiArticle({ owner, repo, slugParts }: WikiArticleProps) {
  const wikiQuery = useWiki(owner, repo);
  const sections = wikiQuery.data?.sections;
  const slug = sections ? resolveSlug(sections, slugParts) : null;
  const location = sections && slug ? locatePage(sections, slug) : null;
  const pageQuery = useWikiPage(owner, repo, location ? slug : null);
  const page = pageQuery.data;

  useEffect(() => {
    if (page) document.title = `${page.title} · ${owner}/${repo}`;
  }, [page, owner, repo]);

  function renderBody() {
    if (wikiQuery.isError) {
      if (isNotFoundError(wikiQuery.error)) return <RepositoryNotFound owner={owner} repo={repo} />;
      return (
        <LoadError message={resolveError(wikiQuery.error)} onRetry={() => void wikiQuery.refetch()} />
      );
    }
    if (!wikiQuery.data) return <ArticleSkeleton />;
    const { repository } = wikiQuery.data;
    if (repository.status === "indexing") return <WikiIndexing />;
    if (repository.status === "failed") return <WikiIndexFailed reason={repository.error} />;
    if (!location) return <PageNotFound owner={owner} repo={repo} />;

    if (pageQuery.isError) {
      if (isNotFoundError(pageQuery.error)) return <PageNotFound owner={owner} repo={repo} />;
      return (
        <LoadError message={resolveError(pageQuery.error)} onRetry={() => void pageQuery.refetch()} />
      );
    }
    if (!page) return <ArticleSkeleton />;

    return (
      <article>
        <ArticleHeader
          repository={wikiQuery.data.repository}
          section={location.current.section}
          page={page}
        />
        <MarkdownContent owner={owner} repo={repo} content={page.content} />
        <PagePager owner={owner} repo={repo} previous={location.previous} next={location.next} />
      </article>
    );
  }

  return (
    <div className="flex gap-12 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="max-w-[46rem] min-w-0 flex-1">{renderBody()}</div>
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-26">
          {page ? <TableOfContents headings={page.headings} /> : null}
        </div>
      </aside>
    </div>
  );
}
