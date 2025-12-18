import * as React from "react"
import { Button as RadixButton } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixButton>, 'size' | 'variant'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "classic" | "solid" | "soft" | "surface"
  size?: "default" | "sm" | "lg" | "icon" | "1" | "2" | "3" | "4"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, ...props }, ref) => {
    // Mapping shadcn variants to Radix Themes variants
    let radixVariant: any = variant
    let radixColor: any = color

    if (variant === "default") radixVariant = "solid"
    if (variant === "destructive") {
        radixVariant = "solid"
        radixColor = "red"
    }
    if (variant === "outline") radixVariant = "outline"
    if (variant === "secondary") radixVariant = "soft"
    if (variant === "ghost") radixVariant = "ghost"
    if (variant === "link") radixVariant = "ghost" // or something else

    // Mapping shadcn sizes to Radix Themes sizes
    let radixSize: any = size
    if (size === "default") radixSize = "2"
    if (size === "sm") radixSize = "1"
    if (size === "lg") radixSize = "3"
    if (size === "icon") radixSize = "1" // Radix sizes are mostly about text/padding

    return (
      <RadixButton
        ref={ref}
        variant={radixVariant || "solid"}
        size={radixSize || "2"}
        color={radixColor}
        className={cn(className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
