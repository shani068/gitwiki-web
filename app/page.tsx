// Home page — public landing page at /
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold tracking-tight">{APP_NAME}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Documentation that stays in step with your code.
      </h1>
      <p className="max-w-prose text-lg text-muted-foreground">
        GitWiki reads a repository and writes a searchable wiki from it, with every page traced back
        to the file and commit it came from.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={ROUTES.WIKIS}>Browse wikis</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
