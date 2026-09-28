// In-memory stand-in for the wiki API, used until the backend serves wiki pages.
// Mirrors the HTTP contract in services/wiki.service.ts, including latency and 404s.
import { WikiNotFoundError } from "@/lib/wiki/errors";
import { extractHeadings } from "@/lib/wiki/headings";
import type { WikiDetail, WikiPage, WikiRepository, WikiSection } from "@/types/wiki";

import { GITWIKI_API_SECTIONS, type FixtureSection } from "./gitwiki-api-pages";

const LATENCY_MS = 350;
const COMMIT_SHA = "3f9a2c1d8e4b7a6f5c0d9e8b7a6f5c4d3e2b1a09";

const repositories: WikiRepository[] = [
  {
    owner:         "shani068",
    name:          "gitwiki-api",
    description:   "Express API that indexes Git repositories and answers questions about them.",
    defaultBranch: "main",
    status:        "ready",
    pageCount:     GITWIKI_API_SECTIONS.reduce((total, section) => total + section.pages.length, 0),
    commitSha:     COMMIT_SHA,
    indexedAt:     "2026-09-27T11:20:00Z",
  },
  {
    owner:         "shani068",
    name:          "gitwiki-web",
    description:   "Next.js client for browsing generated wikis.",
    defaultBranch: "main",
    status:        "indexing",
    pageCount:     0,
    commitSha:     null,
    indexedAt:     null,
  },
  {
    owner:         "shani068",
    name:          "infra-notes",
    description:   "Deployment runbooks and on-call notes.",
    defaultBranch: "main",
    status:        "failed",
    pageCount:     0,
    commitSha:     null,
    indexedAt:     null,
    error:
      "GitHub could not find shani068/infra-notes. Private repositories need a token with read access.",
  },
];

const sectionsByRepo = new Map<string, FixtureSection[]>([
  ["shani068/gitwiki-api", GITWIKI_API_SECTIONS],
]);

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function findRepository(owner: string, name: string): WikiRepository | undefined {
  return repositories.find((r) => r.owner === owner && r.name === name);
}

function toSections(sections: FixtureSection[]): WikiSection[] {
  return sections.map(({ id, title, pages }) => ({
    id,
    title,
    pages: pages.map((page) => ({
      slug:       page.slug,
      title:      page.title,
      sourcePath: page.sourcePath,
      headings:   extractHeadings(page.content),
    })),
  }));
}

export const fixtureWikiSource = {
  listRepositories(): Promise<WikiRepository[]> {
    return wait([...repositories]);
  },

  async getWiki(owner: string, name: string): Promise<WikiDetail> {
    const repository = findRepository(owner, name);
    if (!repository) throw new WikiNotFoundError(`${owner}/${name}`);

    const sections = toSections(sectionsByRepo.get(`${owner}/${name}`) ?? []);
    return wait({ repository, sections });
  },

  async getPage(owner: string, name: string, slug: string): Promise<WikiPage> {
    const page = sectionsByRepo
      .get(`${owner}/${name}`)
      ?.flatMap((section) => section.pages)
      .find((p) => p.slug === slug);
    if (!page) throw new WikiNotFoundError(`Page "${slug}"`);

    return wait({ ...page, headings: extractHeadings(page.content), commitSha: COMMIT_SHA });
  },

  indexRepository(owner: string, name: string): Promise<WikiRepository> {
    const existing = findRepository(owner, name);
    if (existing) return wait(existing);

    const repository: WikiRepository = {
      owner,
      name,
      description:   "",
      defaultBranch: "main",
      status:        "indexing",
      pageCount:     0,
      commitSha:     null,
      indexedAt:     null,
    };
    repositories.unshift(repository);
    return wait(repository);
  },
};
