// Wiki API calls — repositories, a wiki's page tree, single pages, and index requests.
// Reads bundled sample data while WIKI_SOURCE is "fixtures" (see constants/config.ts).
import { WIKI_SOURCE } from "@/constants/config";
import { api } from "@/lib/api";
import { fixtureWikiSource } from "@/lib/wiki/fixtures/fixture-source";
import type { ApiResponse } from "@/types/api";
import type { WikiDetail, WikiPage, WikiRepository } from "@/types/wiki";

const isFixtureSource = WIKI_SOURCE === "fixtures";

const GITHUB_PREFIX = /^https?:\/\/github\.com\//;
const GIT_SUFFIX = /(\.git)?\/?$/;

// Accepts "owner/repo" or a github.com URL, with or without .git
export function parseRepository(input: string): { owner: string; name: string } {
  const [owner = "", name = ""] = input
    .trim()
    .replace(GITHUB_PREFIX, "")
    .replace(GIT_SUFFIX, "")
    .split("/");
  return { owner, name };
}

function repoPath(owner: string, name: string): string {
  return `/api/v1/wikis/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

export const wikiService = {
  async listRepositories(): Promise<WikiRepository[]> {
    if (isFixtureSource) return fixtureWikiSource.listRepositories();
    const res = await api.get<ApiResponse<WikiRepository[]>>("/api/v1/wikis");
    return res.data.data;
  },

  async getWiki(owner: string, name: string): Promise<WikiDetail> {
    if (isFixtureSource) return fixtureWikiSource.getWiki(owner, name);
    const res = await api.get<ApiResponse<WikiDetail>>(repoPath(owner, name));
    return res.data.data;
  },

  async getPage(owner: string, name: string, slug: string): Promise<WikiPage> {
    if (isFixtureSource) return fixtureWikiSource.getPage(owner, name, slug);
    const res = await api.get<ApiResponse<WikiPage>>(`${repoPath(owner, name)}/pages/${slug}`);
    return res.data.data;
  },

  async indexRepository(repo: string): Promise<WikiRepository> {
    const { owner, name } = parseRepository(repo);
    if (isFixtureSource) return fixtureWikiSource.indexRepository(owner, name);
    const res = await api.post<ApiResponse<WikiRepository>>("/api/v1/wikis", {
      repo: `${owner}/${name}`,
    });
    return res.data.data;
  },
};
