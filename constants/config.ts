// App-wide static configuration values
export const APP_NAME    = "GitWiki";
export const APP_VERSION = "0.1.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// The API does not serve wiki pages yet. Until it does, the wiki service reads
// bundled sample data. Set NEXT_PUBLIC_WIKI_SOURCE=api to call the backend.
export const WIKI_SOURCE: "api" | "fixtures" =
  process.env.NEXT_PUBLIC_WIKI_SOURCE === "api" ? "api" : "fixtures";

export const PAGINATION = {
  DEFAULT_PAGE:      1,
  DEFAULT_PAGE_SIZE: 10,
} as const;

export const TOKEN_KEY = "auth_token";
