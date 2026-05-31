"use client"

import { useState } from "react"
import MarkdownBody from "@/components/platform/MarkdownBody"

const textareaCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors resize-none h-full min-h-[280px] font-mono"

interface MarkdownEditorProps {
  name: string
  defaultValue?: string
  rows?: number
  required?: boolean
}

export default function MarkdownEditor({ name, defaultValue = "", required }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Editor */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Editor</p>
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder="Escreva o conteúdo em markdown..."
          className={textareaCls}
        />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Preview</p>
        <div className="min-h-[280px] rounded-xl border border-white/10 bg-[#0d0d0d] p-4 overflow-auto">
          {value.trim() ? (
            <MarkdownBody>{value}</MarkdownBody>
          ) : (
            <p className="text-white/20 text-sm italic">Sem conteúdo</p>
          )}
        </div>
      </div>
    </div>
  )
}
