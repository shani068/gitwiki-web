// Wiki reader layout — keeps the header and page tree mounted while pages change
import type { Metadata } from "next";

import { WikiShell } from "@/components/features/wiki/wiki-shell";

export async function generateMetadata({
  params,
}: LayoutProps<"/wikis/[owner]/[repo]">): Promise<Metadata> {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo}` };
}

export default async function WikiLayout({ children, params }: LayoutProps<"/wikis/[owner]/[repo]">) {
  const { owner, repo } = await params;
  return (
    <WikiShell owner={decodeURIComponent(owner)} repo={decodeURIComponent(repo)}>
      {children}
    </WikiShell>
  );
}
