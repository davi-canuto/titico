'use client'

import { useRef } from 'react'

const inputCls =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50"

export default function SlugInput() {
  const slugRef = useRef<HTMLInputElement>(null)
  const userEditedSlug = useRef(false)

  function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (userEditedSlug.current) return
    if (slugRef.current) {
      slugRef.current.value = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
  }

  return (
    <>
      <div>
        <label className={labelCls} htmlFor="name">Nome *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Coaching 1:1"
          className={inputCls}
          onChange={handleNameInput}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="slug">Slug *</label>
        <input
          ref={slugRef}
          id="slug"
          name="slug"
          type="text"
          required
          placeholder="coaching-1x1"
          className={inputCls}
          onChange={() => { userEditedSlug.current = true }}
        />
        <p className="mt-1 text-xs text-white/30">Identificador único usado internamente (ex: guia-shaco-ad)</p>
      </div>
    </>
  )
}
