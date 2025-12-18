"use client"

import * as React from "react"
import { DropdownMenu as RadixDropdownMenu } from "@radix-ui/themes"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

const DropdownMenu = RadixDropdownMenu.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof RadixDropdownMenu.Content>) {
  return <RadixDropdownMenu.Content className={cn(className)} {...props} />
}

function DropdownMenuItem({ className, variant, ...props }: React.ComponentProps<typeof RadixDropdownMenu.Item> & { variant?: "default" | "destructive" }) {
  return (
    <RadixDropdownMenu.Item 
      className={cn(className)} 
      color={variant === "destructive" ? "red" : undefined}
      {...props} 
    />
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof RadixDropdownMenu.Label>) {
  return <RadixDropdownMenu.Label className={cn(className)} {...props} />
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof RadixDropdownMenu.Separator>) {
  return <RadixDropdownMenu.Separator className={cn(className)} {...props} />
}

function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</> // Radix Themes DropdownMenu doesn't have a Group component in the same way
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return <span className={cn("ml-auto text-xs opacity-60", className)} {...props} />
}

function DropdownMenuSub(props: React.ComponentProps<typeof RadixDropdownMenu.Sub>) {
  return <RadixDropdownMenu.Sub {...props} />
}

function DropdownMenuSubTrigger(props: React.ComponentProps<typeof RadixDropdownMenu.SubTrigger>) {
  return <RadixDropdownMenu.SubTrigger {...props} />
}

function DropdownMenuSubContent(props: React.ComponentProps<typeof RadixDropdownMenu.SubContent>) {
  return <RadixDropdownMenu.SubContent {...props} />
}

function DropdownMenuCheckboxItem(props: React.ComponentProps<typeof RadixDropdownMenu.CheckboxItem>) {
  return <RadixDropdownMenu.CheckboxItem {...props} />
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof RadixDropdownMenu.RadioGroup>) {
  return <RadixDropdownMenu.RadioGroup {...props} />
}

function DropdownMenuRadioItem(props: React.ComponentProps<typeof RadixDropdownMenu.RadioItem>) {
  return <RadixDropdownMenu.RadioItem {...props} />
}

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
