"use client"

import * as React from "react"
import { Dialog as RadixDialog, Flex } from "@radix-ui/themes"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Dialog = RadixDialog.Root
const DialogTrigger = DialogPrimitive.Trigger

function DialogContent({ className, children, ...props }: React.ComponentProps<typeof RadixDialog.Content>) {
  return (
    <RadixDialog.Content className={cn(className)} {...props}>
      {children}
    </RadixDialog.Content>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left mb-4", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Flex
      gap="3"
      justify="end"
      className={cn("mt-6", className)}
      {...props}
    />
  )
}

function DialogTitle(props: React.ComponentProps<typeof RadixDialog.Title>) {
  return <RadixDialog.Title {...props} />
}

function DialogDescription(props: React.ComponentProps<typeof RadixDialog.Description>) {
  return <RadixDialog.Description {...props} />
}

function DialogClose(props: React.ComponentProps<typeof RadixDialog.Close>) {
  return <RadixDialog.Close {...props} />
}

// Portals and Overlays are handled internally by Radix Themes Dialog
const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DialogOverlay = () => null

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
