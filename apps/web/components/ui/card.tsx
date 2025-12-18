import * as React from "react"
import { Card as RadixCard, Flex, Heading, Text } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<typeof RadixCard>) {
  return (
    <RadixCard
      className={cn(className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 mb-4", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      size="4"
      className={cn(className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      size="2"
      color="gray"
      className={cn(className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("ml-auto", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Flex
      align="center"
      className={cn("mt-4 pt-4 border-t border-gray-200 dark:border-gray-800", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
