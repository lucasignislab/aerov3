"use client"

import * as React from "react"
import { Select as RadixSelect } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

function Select(props: React.ComponentProps<typeof RadixSelect.Root>) {
  return <RadixSelect.Root {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof RadixSelect.Group>) {
  return <RadixSelect.Group {...props} />
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <>{placeholder}</> // In Radix Themes, the trigger handles this, but we keep the export for compatibility if used as a child
}

function SelectTrigger({ className, ...props }: React.ComponentProps<typeof RadixSelect.Trigger>) {
  return <RadixSelect.Trigger className={cn(className)} {...props} />
}

function SelectContent({ className, ...props }: React.ComponentProps<typeof RadixSelect.Content>) {
  return <RadixSelect.Content className={cn(className)} {...props} />
}

function SelectLabel(props: React.ComponentProps<typeof RadixSelect.Label>) {
  return <RadixSelect.Label {...props} />
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item className={cn(className)} {...props}>
      {children}
    </RadixSelect.Item>
  )
}

function SelectSeparator(props: React.ComponentProps<typeof RadixSelect.Separator>) {
  return <RadixSelect.Separator {...props} />
}

// These are handled internally or not needed in Radix Themes Select
const SelectScrollUpButton = () => null
const SelectScrollDownButton = () => null

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
