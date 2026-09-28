// Repository library — route: /wikis
import type { Metadata } from "next";

import Link from "next/link";

import { RepositoryLibrary } from "@/components/features/wiki/repository-library";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { APP_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Repositories" };

export default function WikisPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ROUTES.WIKIS}
            className="rounded-sm text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {APP_NAME}
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <RepositoryLibrary />
      </main>
    </div>
  );
}
