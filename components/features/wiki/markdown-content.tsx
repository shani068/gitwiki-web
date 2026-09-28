// Renders a page's Markdown — GFM tables, heading anchors, highlighted code, wiki links
import Link from "next/link";

import { isValidElement } from "react";

import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { wikiPath } from "@/constants/routes";

import { CodeBlock } from "./code-block";

const EXTERNAL_LINK = /^[a-z][a-z\d+.-]*:/i;
const LANGUAGE_CLASS = /language-([\w-]+)/;

interface MarkdownContentProps {
  owner:   string;
  repo:    string;
  content: string;
}

function codeLanguage(children: React.ReactNode): string | undefined {
  if (!isValidElement<{ className?: string }>(children)) return undefined;
  return LANGUAGE_CLASS.exec(children.props.className ?? "")?.[1];
}

function buildComponents(owner: string, repo: string): Components {
  return {
    // Relative links in wiki Markdown are page slugs; anchors and URLs pass through
    a({ href = "", children }) {
      if (href.startsWith("#")) return <a href={href}>{children}</a>;
      if (EXTERNAL_LINK.test(href)) {
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        );
      }
      return <Link href={wikiPath(owner, repo, href.replace(/^\.?\//, ""))}>{children}</Link>;
    },
    pre({ children }) {
      return <CodeBlock language={codeLanguage(children)}>{children}</CodeBlock>;
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto" role="region" aria-label="Table" tabIndex={0}>
          <table>{children}</table>
        </div>
      );
    },
  };
}

export function MarkdownContent({ owner, repo, content }: MarkdownContentProps) {
  return (
    <div className="wiki-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: false }]]}
        components={buildComponents(owner, repo)}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
