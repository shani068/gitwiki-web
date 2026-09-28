// Non-content states for the reader — loading, missing, still indexing, and failed
import Link from "next/link";

import { FileQuestionIcon, RotateCwIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES, wikiPath } from "@/constants/routes";
import { cn } from "@/utils/cn";

const BODY_LINES = [
  { id: "l1", width: "w-full" },
  { id: "l2", width: "w-11/12" },
  { id: "l3", width: "w-full" },
  { id: "l4", width: "w-4/5" },
  { id: "l5", width: "w-full" },
  { id: "l6", width: "w-2/3" },
];

export function ArticleSkeleton() {
  return (
    <div aria-busy aria-label="Loading page" className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="mt-8 flex flex-col gap-3">
        {BODY_LINES.map(({ id, width }) => (
          <Skeleton key={id} className={cn("h-4", width)} />
        ))}
      </div>
      <Skeleton className="mt-4 h-40 w-full" />
    </div>
  );
}

export function PageNotFound({ owner, repo }: { owner: string; repo: string }) {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon />
        </EmptyMedia>
        <EmptyTitle>This page isn&apos;t in the wiki</EmptyTitle>
        <EmptyDescription>
          It may have been renamed or removed in the latest commit. Search the wiki or start from
          the first page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={wikiPath(owner, repo)}>Go to first page</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function RepositoryNotFound({ owner, repo }: { owner: string; repo: string }) {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon />
        </EmptyMedia>
        <EmptyTitle>
          No wiki for <span className="font-mono">{`${owner}/${repo}`}</span>
        </EmptyTitle>
        <EmptyDescription>Add the repository to generate its wiki.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={ROUTES.WIKIS}>Browse repositories</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function WikiIndexing() {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Generating this wiki</EmptyTitle>
        <EmptyDescription>
          GitWiki is reading the repository and writing its pages. Large repositories take a few
          minutes.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

interface LoadErrorProps {
  message:  string;
  onRetry:  () => void;
  title?:   string;
}

export function WikiIndexFailed({ reason }: { reason?: string }) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>This wiki couldn’t be generated</AlertTitle>
      <AlertDescription>
        <p>{reason ?? "The last index run failed."}</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href={ROUTES.WIKIS}>Back to repositories</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function LoadError({ message, onRetry, title = "The page didn’t load" }: LoadErrorProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          <RotateCwIcon data-icon="inline-start" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
