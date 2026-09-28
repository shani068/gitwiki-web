// Global 404 page — rendered whenever Next.js cannot match a route
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="font-mono text-sm text-muted-foreground">404</span>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Button asChild className="mt-2">
        <Link href={ROUTES.WIKIS}>Browse wikis</Link>
      </Button>
    </main>
  );
}
