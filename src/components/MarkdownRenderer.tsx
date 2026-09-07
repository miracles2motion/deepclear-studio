"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

interface AgentTagConfig {
  tag: string;
  name: string;
  avatar: string;
  badgeClass: string;
}

const AGENT_TAGS: Record<string, AgentTagConfig> = {
  "@legal_counsel": {
    tag: "@legal_counsel",
    name: "Legal Counsel",
    avatar: "⚖️",
    badgeClass:
      "bg-sky-950/80 border-sky-500/50 text-sky-300 hover:bg-sky-900/90 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
  },
  "@director": {
    tag: "@director",
    name: "The Director",
    avatar: "🎬",
    badgeClass:
      "bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900/90 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
  },
  "@location_manager": {
    tag: "@location_manager",
    name: "Location & Art Manager",
    avatar: "📍",
    badgeClass:
      "bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/90 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
  },
  "@script_supervisor": {
    tag: "@script_supervisor",
    name: "Script Supervisor",
    avatar: "📋",
    badgeClass:
      "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/90 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
  },
  "@bond_officer": {
    tag: "@bond_officer",
    name: "Completion Bond Officer",
    avatar: "🛡️",
    badgeClass:
      "bg-indigo-950/80 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/90 shadow-[0_0_10px_rgba(99,102,241,0.2)]",
  },
};

/**
 * Recursively parses children to find @agent mentions and transforms them into
 * styled, uniquely colored interactive badges matching their agent persona.
 */
function highlightAgentTags(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") {
    const regex = /(@(?:legal_counsel|director|location_manager|script_supervisor|bond_officer|counsel|location|supervisor|bond)\b)/gi;
    const parts = children.split(regex);
    if (parts.length === 1) return children;

    return parts.map((part, idx) => {
      const lower = part.toLowerCase();
      const mappedTag =
        lower === "@counsel"
          ? "@legal_counsel"
          : lower === "@location"
          ? "@location_manager"
          : lower === "@supervisor"
          ? "@script_supervisor"
          : lower === "@bond"
          ? "@bond_officer"
          : lower;

      const tagConfig = AGENT_TAGS[mappedTag];
      if (tagConfig) {
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 mx-1 my-0.5 rounded-lg text-xs font-mono font-semibold border transition-all select-none align-baseline tracking-tight ${tagConfig.badgeClass}`}
            title={`${tagConfig.name} (${part})`}
          >
            <span className="text-[11px] leading-none">{tagConfig.avatar}</span>
            <span>{part}</span>
          </span>
        );
      }
      return part;
    });
  }

  if (Array.isArray(children)) {
    return React.Children.map(children, (child) => highlightAgentTags(child));
  }

  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props && props.children) {
      return React.cloneElement(
        children as React.ReactElement<any>,
        {},
        highlightAgentTags(props.children)
      );
    }
  }

  return children;
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
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{highlightAgentTags(children)}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-100">{highlightAgentTags(children)}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-300">{highlightAgentTags(children)}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2 space-y-1 text-zinc-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 space-y-1 text-zinc-300">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{highlightAgentTags(children)}</li>
          ),
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
              {highlightAgentTags(children)}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-zinc-100 mt-3 mb-1.5">
              {highlightAgentTags(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-zinc-100 mt-2.5 mb-1">
              {highlightAgentTags(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-zinc-100 mt-2 mb-1">
              {highlightAgentTags(children)}
            </h3>
          ),
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
