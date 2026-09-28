// Wiki domain types — a repository is indexed into sections of Markdown pages

export type IndexStatus = "ready" | "indexing" | "failed";

export interface WikiRepository {
  owner:         string;
  name:          string;
  description:   string;
  defaultBranch: string;
  status:        IndexStatus;
  pageCount:     number;
  /** Commit the wiki was generated from; null until the first index finishes */
  commitSha:     string | null;
  indexedAt:     string | null;
  /** Why the last index failed, when status is "failed" */
  error?:        string;
}

export interface WikiHeading {
  id:    string;
  text:  string;
  depth: 2 | 3;
}

export interface WikiPageSummary {
  slug:       string;
  title:      string;
  /** Repository file the page was generated from */
  sourcePath: string;
  headings:   WikiHeading[];
}

export interface WikiSection {
  id:    string;
  title: string;
  pages: WikiPageSummary[];
}

export interface WikiDetail {
  repository: WikiRepository;
  sections:   WikiSection[];
}

export interface WikiPage extends WikiPageSummary {
  /** Markdown body */
  content:       string;
  updatedAt:     string;
  commitSha:     string;
  commitMessage: string;
}

export interface IndexRepositoryPayload {
  /** "owner/repo" or a github.com URL */
  repo: string;
}
