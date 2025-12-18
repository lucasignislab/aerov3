import * as React from "react"
import { Badge as RadixBadge } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

export interface BadgeProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixBadge>, 'variant'> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "solid" | "soft" | "surface"
}

function Badge({
  className,
  variant,
  color,
  ...props
}: BadgeProps) {
  // Mapping shadcn variants to Radix Themes
  let radixVariant: any = variant
  let radixColor: any = color

  if (variant === "default") radixVariant = "solid"
  if (variant === "secondary") radixVariant = "soft"
  if (variant === "destructive") {
    radixVariant = "solid"
    radixColor = "red"
  }
  if (variant === "outline") radixVariant = "outline"

  return (
    <RadixBadge
      variant={radixVariant || "solid"}
      color={radixColor}
      className={cn(className)}
      {...props}
    />
  )
}

export { Badge }
