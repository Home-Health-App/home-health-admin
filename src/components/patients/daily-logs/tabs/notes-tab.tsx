import React from "react"

interface NotesTabProps {
  notes: Array<{
    text: string
  }>
}

export default function NotesTab({ notes }: NotesTabProps) {
  if (notes.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-sans text-sm italic">
        No notes recorded at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {notes.map((note, index) => (
        <div
          key={index}
          className="p-5 bg-[#EEF2F6]/40 border border-zinc-200/50 rounded-2xl font-sans text-sm leading-relaxed text-body-text flex flex-col gap-2"
        >
          <span className="font-bold text-zinc-800 text-xs uppercase tracking-wider block">
            Note
          </span>
          <p>{note.text}</p>
        </div>
      ))}
    </div>
  )
}
