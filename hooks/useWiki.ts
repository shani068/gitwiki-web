// TanStack Query wrappers around wikiService — one cache entry per repo and per page
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { isNotFoundError } from "@/lib/wiki/errors";
import { wikiService } from "@/services/wiki.service";
import type { WikiRepository } from "@/types/wiki";
import { resolveError } from "@/utils/resolve-error";

const WIKI_STALE_TIME = 5 * 60 * 1000;

export const wikiKeys = {
  repositories: ["wiki", "repositories"] as const,
  detail: (owner: string, repo: string) => ["wiki", owner, repo] as const,
  page: (owner: string, repo: string, slug: string) => ["wiki", owner, repo, "page", slug] as const,
};

// A missing page won't appear on retry; anything else gets one more attempt
function retryUnlessNotFound(failureCount: number, error: Error): boolean {
  return !isNotFoundError(error) && failureCount < 1;
}

export function useRepositories() {
  return useQuery({
    queryKey: wikiKeys.repositories,
    queryFn:  () => wikiService.listRepositories(),
  });
}

export function useWiki(owner: string, repo: string) {
  return useQuery({
    queryKey:  wikiKeys.detail(owner, repo),
    queryFn:   () => wikiService.getWiki(owner, repo),
    retry:     retryUnlessNotFound,
    staleTime: WIKI_STALE_TIME,
  });
}

export function useWikiPage(owner: string, repo: string, slug: string | null) {
  return useQuery({
    queryKey:  wikiKeys.page(owner, repo, slug ?? ""),
    queryFn:   () => wikiService.getPage(owner, repo, slug ?? ""),
    enabled:   slug !== null,
    retry:     retryUnlessNotFound,
    staleTime: WIKI_STALE_TIME,
  });
}

interface UseIndexRepositoryOptions {
  onSuccess?: (repository: WikiRepository) => void;
  onError?:   (message: string) => void;
}

export function useIndexRepository(options: UseIndexRepositoryOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repo: string) => wikiService.indexRepository(repo),
    onSuccess: (repository) => {
      void queryClient.invalidateQueries({ queryKey: wikiKeys.repositories });
      options.onSuccess?.(repository);
    },
    onError: (error) => options.onError?.(resolveError(error)),
  });
}
