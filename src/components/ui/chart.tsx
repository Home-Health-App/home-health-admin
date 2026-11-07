"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/libs/utils"

// Helper to get color values
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<string, string>
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

export function ChartContainer({
  id,
  className,
  config,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const uniqueId = React.useId()
  const chartId = id || `chart-${uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart-container"
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <div data-chart={chartId} className="w-full h-full">
          <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, value]) => value.color
  )

  if (colorConfig.length === 0) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          [data-chart="${id}"] {
            ${colorConfig
              .map(
                ([key, value]) => `
              --color-${key}: ${value.color};
            `
              )
              .join("\n")}
          }
        `,
      }}
    />
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  className,
}: any) {
  const { config } = useChart()
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white p-2 shadow-xs text-xs font-sans text-heading-text font-medium space-y-1.5 min-w-[120px]",
        className
      )}
    >
      {!hideLabel && <div className="text-[10px] text-zinc-400 font-bold font-sans uppercase tracking-wider">{label}</div>}
      <div className="space-y-1">
        {payload.map((item: any, index: number) => {
          const configItem = config[item.name] || config[item.dataKey]
          const color = item.color || item.fill
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-xs shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-zinc-500 font-sans">{configItem?.label || item.name}</span>
              </div>
              <span className="font-bold font-sans text-heading-text">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChartLegend = RechartsPrimitive.Legend
