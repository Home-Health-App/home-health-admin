import React from "react"

export interface NoteDisplayItem {
  id?: string
  text: string
  time?: string
}

interface NotesTabProps {
  notes: NoteDisplayItem[]
}

export default function NotesTab({ notes }: NotesTabProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No caregiver notes recorded at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {notes.map((note, index) => (
        <div
          key={note.id || index}
          className="p-6 flex flex-col items-start justify-start bg-secondary-light rounded-[8px] font-dm-san-regular text-sm leading-relaxed text-body-text gap-3 shadow-2xs"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-zinc-800 text-sm uppercase tracking-wider block shrink-0">
              Caregiver Note
            </span>
            {note.time && (
              <span className="text-xs text-body-text font-normal font-dm-san-regular">
                {note.time}
              </span>
            )}
          </div>
          <p className="text-sm text-body-text font-normal">{note.text}</p>
        </div>
      ))}
    </div>
  )
}


