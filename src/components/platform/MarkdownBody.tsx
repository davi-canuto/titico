"use client"

import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import type { Components } from "react-markdown"

const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-xl font-black uppercase tracking-tight text-white mt-8 mb-3 border-l-2 border-[#e3001b] pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-black uppercase tracking-tight text-white mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-white/80 leading-relaxed my-2">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-2 my-4 text-white/80">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-white/80">
      <span className="text-[#e3001b] font-black shrink-0">·</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/80">{children}</em>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-[#e3001b] hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ inline, children, ...props }: any) =>
    inline ? (
      <code className="bg-[#161616] border border-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-white/90" {...props}>
        {children}
      </code>
    ) : (
      <code className="text-white/80 font-mono text-sm" {...props}>{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="bg-[#161616] border border-white/10 rounded-xl p-4 overflow-x-auto my-4 text-sm font-mono">
      {children}
    </pre>
  ),
}

export default function MarkdownBody({ children }: { children: string }) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
