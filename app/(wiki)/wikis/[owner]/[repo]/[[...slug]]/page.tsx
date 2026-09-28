// Wiki page — route: /wikis/:owner/:repo/[...slug]; no slug shows the first page
import { WikiArticle } from "@/components/features/wiki/wiki-article";

export default async function WikiPageRoute({
  params,
}: PageProps<"/wikis/[owner]/[repo]/[[...slug]]">) {
  const { owner, repo, slug } = await params;
  return (
    <WikiArticle
      key={slug?.join("/") ?? ""}
      owner={decodeURIComponent(owner)}
      repo={decodeURIComponent(repo)}
      slugParts={slug}
    />
  );
}
