// Central route map — import ROUTES instead of hardcoding path strings
export const ROUTES = {
  HOME:      "/",
  LOGIN:     "/login",
  REGISTER:  "/register",
  DASHBOARD: "/dashboard",
  SETTINGS:  "/settings",
  WIKIS:     "/wikis",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// /wikis/:owner/:repo[/:slug...] — slug segments are already URL-safe
export function wikiPath(owner: string, repo: string, slug?: string): string {
  const base = `${ROUTES.WIKIS}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  return slug ? `${base}/${slug}` : base;
}
