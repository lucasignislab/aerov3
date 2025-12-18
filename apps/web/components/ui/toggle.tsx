"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "@/lib/utils"

function Toggle({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & {
    size?: "default" | "sm" | "lg"
    variant?: "default" | "outline"
}) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-iris-100 dark:data-[state=on]:bg-iris-900/40 data-[state=on]:text-iris-900 dark:data-[state=on]:text-iris-100 outline-none transition-colors px-2",
        size === "sm" ? "h-8 px-1.5" : size === "lg" ? "h-10 px-2.5" : "h-9 px-2",
        variant === "outline" && "border border-gray-200 dark:border-gray-800",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
