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
        let cardClass = "bg-active-btn border-l-active-border text-active-border"
        let iconColor = "text-active-border"

        if (
          nameLower.includes("sad") ||
          nameLower.includes("anxious") ||
          nameLower.includes("depressed")
        ) {
          Icon = PiSmileySadFill
          cardClass = "bg-warning-btn border-l-warning-border text-warning-border"
          iconColor = "text-warning-border"
        } else if (
          nameLower.includes("neutral") ||
          nameLower.includes("confused")
        ) {
          Icon = BsEmojiNeutralFill
          cardClass = "bg-secondary-light border-l-zinc-700 text-body-text"
          iconColor = "text-body-text"
        } else {
          Icon = HiEmojiHappy
          cardClass = "bg-active-btn border-l-active-border text-active-border"
          iconColor = "text-active-border"
        }

        return (
          <div
            key={index}
            className={`p-6 rounded-[8px] shadow-2xs space-y-4 ${cardClass} border-l-[6px]`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`size-8 ${iconColor}`} />
              <h3 className="text-xl font-bold font-dm-san-regular text-heading-text capitalize">
                {item.name}
              </h3>
            </div>
            {item.note && (
              <div className="bg-white/90 border border-zinc-200/40 rounded-[8px] p-4 text-sm font-dm-san-regular leading-relaxed text-body-text flex gap-4">
                <span className="font-semibold text-heading-text shrink-0 select-none">
                  Note
                </span>
                <p className="text-body-text">{item.note}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

