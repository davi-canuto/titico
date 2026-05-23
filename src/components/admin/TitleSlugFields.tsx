"use client"

import { useState } from "react"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"

interface TitleSlugFieldsProps {
  defaultTitle?: string
  defaultSlug?: string
}

export default function TitleSlugFields({ defaultTitle = "", defaultSlug = "" }: TitleSlugFieldsProps) {
  const [slug, setSlug] = useState(defaultSlug)
  const [slugEdited, setSlugEdited] = useState(!!defaultSlug)

  return (
    <>
      <div>
        <label className={labelCls}>Título *</label>
        <input
          name="title"
          required
          defaultValue={defaultTitle}
          placeholder="Ex: Shaco vs Graves — como sobreviver"
          className={inputCls}
          onChange={(e) => {
            if (!slugEdited) setSlug(slugify(e.target.value))
          }}
        />
      </div>
      <div>
        <label className={labelCls}>Slug *</label>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          placeholder="ex: shaco-vs-graves"
          className={inputCls}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugEdited(true)
          }}
        />
        <p className="mt-1 text-xs text-white/30">Apenas letras minúsculas, números e hífens</p>
      </div>
    </>
  )
}
