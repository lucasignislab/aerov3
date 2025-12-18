"use client"

import * as React from "react"
import { Avatar as RadixAvatar } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<typeof RadixAvatar>) {
  return (
    <RadixAvatar
      className={cn(className)}
      {...props}
    />
  )
}

// For compatibility with shadcn structure
const AvatarImage = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) => null // Radix Themes Avatar handles src/alt directly
const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => null // Radix Themes Avatar handles fallback directly

export { Avatar, AvatarImage, AvatarFallback }
