import React from "react"

interface NotesTabProps {
  notes: Array<{
    text: string
  }>
}

export default function NotesTab({ notes }: NotesTabProps) {
  if (notes.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No notes recorded at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {notes.map((note, index) => (
        <div
          key={index}
          className="p-6 flex items-start justify-start bg-secondary-light rounded-[8px] font-dm-san-regular text-sm leading-relaxed text-body-text gap-4"
        >
          <span className="font-bold text-zinc-800 text-sm uppercase tracking-wider block">
            Note
          </span>
          <p className="text-sm text-body-text font-normal">{note.text}</p>
        </div>
      ))}
    </div>
  )
}
