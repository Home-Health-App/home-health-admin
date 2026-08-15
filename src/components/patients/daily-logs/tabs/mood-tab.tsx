import React from "react"

interface MoodTabProps {
  mood: {
    emoji: string
    name: string
    note: string
    severityClass: string
  }
}

export default function MoodTab({ mood }: MoodTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`p-6 border-l-4 rounded-r-2xl rounded-l-md shadow-2xs space-y-4 ${mood.severityClass} border-zinc-200`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{mood.emoji}</span>
          <h3 className="text-lg font-bold font-sans text-zinc-950">
            {mood.name}
          </h3>
        </div>
        <div className="bg-white border border-zinc-200/40 rounded-xl p-4 text-sm font-sans leading-relaxed text-body-text">
          <span className="font-bold text-zinc-900 block mb-1">Note</span>
          {mood.note}
        </div>
      </div>
    </div>
  )
}
