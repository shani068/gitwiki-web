// Fenced code block — language label and a copy button over highlighted code
"use client";

import { useRef, useState } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const COPIED_RESET_MS = 2000;

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Shell",
  sh:   "Shell",
  ts:   "TypeScript",
  tsx:  "TSX",
  js:   "JavaScript",
  json: "JSON",
  yaml: "YAML",
  sql:  "SQL",
};

export function CodeBlock({ language, children }: { language?: string; children: React.ReactNode }) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const label = language ? (LANGUAGE_LABELS[language] ?? language) : "Text";

  async function handleCopy() {
    const text = codeRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the code stays selectable
    }
  }

  return (
    <figure className="overflow-hidden rounded-md border bg-code">
      <figcaption className="flex h-9 items-center justify-between border-b pr-1 pl-3.5 text-xs text-muted-foreground">
        <span>{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleCopy()}
              aria-label={isCopied ? "Copied" : "Copy code"}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCopied ? "Copied" : "Copy code"}</TooltipContent>
        </Tooltip>
        <span className="sr-only" aria-live="polite">
          {isCopied ? "Code copied to clipboard" : ""}
        </span>
      </figcaption>
      <pre
        ref={codeRef}
        className="overflow-x-auto px-4 py-3.5 font-mono text-[0.8125rem] leading-relaxed"
      >
        {children}
      </pre>
    </figure>
  );
}
