// Index status label — icon plus text so the state never relies on colour alone
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import type { IndexStatus as Status } from "@/types/wiki";
import { cn } from "@/utils/cn";

const LABELS: Record<Status, string> = {
  ready:    "Indexed",
  indexing: "Indexing",
  failed:   "Index failed",
};

export function IndexStatus({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
        status === "ready" && "text-primary",
        status === "indexing" && "text-caution",
        status === "failed" && "text-destructive",
        className
      )}
    >
      {status === "ready" && <CircleCheckIcon className="size-3.5" aria-hidden />}
      {status === "indexing" && <Spinner className="size-3.5" aria-hidden />}
      {status === "failed" && <CircleAlertIcon className="size-3.5" aria-hidden />}
      {LABELS[status]}
    </span>
  );
}
