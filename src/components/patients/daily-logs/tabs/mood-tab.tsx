import React from "react"
import { BsEmojiNeutralFill } from "react-icons/bs"
import { PiSmileySadFill } from "react-icons/pi"
import { HiEmojiHappy } from "react-icons/hi"

export interface MoodDisplayItem {
  emoji?: string
  name: string
  note?: string | null
  severityClass?: string
}

interface MoodTabProps {
  mood?: MoodDisplayItem | MoodDisplayItem[] | null
}

export default function MoodTab({ mood }: MoodTabProps) {
  const moodItems = Array.isArray(mood) ? mood : mood ? [mood] : []

  if (moodItems.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No mood records noted at this time.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {moodItems.map((item, index) => {
        const nameLower = (item.name || "").toLowerCase()
        let Icon = HiEmojiHappy
        let cardClass = "bg-[#EBF3EF]/40 border-l-[#2E7D32] text-[#2E7D32]"
        let iconColor = "text-[#2E7D32]"

        if (
          nameLower.includes("sad") ||
          nameLower.includes("anxious") ||
          nameLower.includes("depressed")
        ) {
          Icon = PiSmileySadFill
          cardClass = "bg-[#FAF0F0] border-l-[#C53929] text-[#C53929]"
          iconColor = "text-[#C53929]"
        } else if (
          nameLower.includes("neutral") ||
          nameLower.includes("confused")
        ) {
          Icon = BsEmojiNeutralFill
          cardClass = "bg-[#F4F4F5] border-l-zinc-700 text-zinc-700"
          iconColor = "text-zinc-700"
        } else {
          Icon = HiEmojiHappy
          cardClass = "bg-[#EBF3EF]/40 border-l-[#2E7D32] text-[#2E7D32]"
          iconColor = "text-[#2E7D32]"
        }

        return (
          <div
            key={index}
            className={`p-6 rounded-[8px] shadow-2xs space-y-4 ${cardClass} border-l-[6px]`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`size-8 ${iconColor}`} />
              <h3 className="text-xl font-bold font-dm-san-regular text-zinc-900 capitalize">
                {item.name}
              </h3>
            </div>
            {item.note && (
              <div className="bg-white/90 border border-zinc-200/40 rounded-[8px] p-4 text-sm font-dm-san-regular leading-relaxed text-body-text flex gap-4">
                <span className="font-semibold text-zinc-900 shrink-0 select-none">
                  Note
                </span>
                <p className="text-zinc-800">{item.note}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

