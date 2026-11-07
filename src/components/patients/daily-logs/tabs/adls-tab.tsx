import React from "react"
import { Badge } from "@/components/ui/badge"

export interface AdlCategoryItem {
  title: string
  status?: string | null
  note?: string | null
}

export interface AdlDisplayItem {
  id?: string
  categories: AdlCategoryItem[]
}

interface AdlsTabProps {
  adls: AdlDisplayItem[]
}

export default function AdlsTab({ adls }: AdlsTabProps) {
  if (!adls || adls.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No ADL records noted at this time.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {adls.map((adlGroup, groupIndex) => (
        <div key={adlGroup.id || groupIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adlGroup.categories.map((cat, catIndex) => (
            <div
              key={catIndex}
              className="p-5 bg-secondary-light rounded-[8px] space-y-3 flex flex-col justify-between shadow-2xs"
            >
              <div>
                <span className="text-xs font-normal text-body-text font-dm-san-regular block">
                  {cat.title}
                </span>
                <span className="text-lg font-semibold font-dm-san-regular text-body-text block mt-1">
                  {cat.status || "Completed"}
                </span>
              </div>

              {cat.note && (
                <div className="pt-2 border-t border-zinc-200/40 text-xs font-dm-san-regular text-body-text leading-relaxed">
                  <span className="font-semibold text-body-text mr-1.5">Note:</span>
                  <span>{cat.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
