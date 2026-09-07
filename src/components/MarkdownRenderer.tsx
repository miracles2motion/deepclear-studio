"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content = "",
  className = "",
}) => {
  if (!content) return null;

  return (
    <div className={`prose prose-invert max-w-none break-words text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
          em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-zinc-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-zinc-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-300 font-mono text-[11px] border border-white/10">
                {children}
              </code>
            ) : (
              <code className="block p-2 rounded-lg bg-zinc-950 font-mono text-xs text-zinc-200 border border-white/10 overflow-x-auto my-2">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-sky-400/60 pl-3 italic text-zinc-400 my-2">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => <h1 className="text-base font-bold text-zinc-100 mt-3 mb-1.5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold text-zinc-100 mt-2.5 mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-bold text-zinc-100 mt-2 mb-1">{children}</h3>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors font-medium"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-white/[0.08] my-3" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
