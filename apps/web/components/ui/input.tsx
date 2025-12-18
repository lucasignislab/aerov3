import * as React from "react"
import { TextField } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<typeof TextField.Root>) {
  return (
    <TextField.Root
      size="2"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

export { Input }
