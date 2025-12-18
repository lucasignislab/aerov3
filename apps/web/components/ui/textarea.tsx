import * as React from "react"
import { TextArea as RadixTextArea } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<typeof RadixTextArea>) {
  return (
    <RadixTextArea
      size="2"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

export { Textarea }
