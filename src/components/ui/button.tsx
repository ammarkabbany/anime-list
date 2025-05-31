import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: // Primary gradient button
          "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg border-b-4 border-purple-700 active:border-b-0 active:mt-1 active:shadow-sm",
        destructive: // Destructive gradient button
          "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg border-b-4 border-red-700 active:border-b-0 active:mt-1 active:shadow-sm",
        outline: // Outline with gradient border idea - simpler active state
          "border border-pink-500 bg-transparent text-pink-500 hover:bg-pink-500/10 hover:text-pink-600 shadow-sm active:scale-[0.99]",
        secondary: // Secondary gradient button
          "bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white shadow-sm hover:shadow-md border-b-2 border-sky-600 active:border-b-0 active:mt-0.5 active:shadow-xs",
        ghost: // Ghost with themed hover
          "text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 active:scale-[0.99]",
        link: // Link with themed colors
          "text-purple-500 underline-offset-4 hover:underline hover:text-pink-500 active:scale-[0.99]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5", // Adjusted text size for sm
        lg: "h-10 rounded-md px-6 text-base has-[>svg]:px-4", // Adjusted text size for lg
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Adjust padding for border press effect to maintain perceived size
// This can be tricky and might need case-by-case adjustments or a different approach if it becomes too complex.
// For variants with border-b-4: active:pb-[calc(theme(spacing.2)-4px)] might be needed if h-9 includes padding.
// For now, the active:mt-1 will shift it, and text vertical alignment might be slightly affected.
// The provided active:mb-[0px] active:pb-[4px] is not directly translatable without knowing exact box model.
// Simpler: active:translate-y-px for a slight press down effect if border effect is too complex.
// Let's stick to active:mt-1 or active:mt-0.5 which means the button height reduces slightly.

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Add specific padding adjustments for border press effect if needed here by inspecting variant + size
  // This is a common pattern if the border effect makes the button jump too much.
  // For example:
  // let dynamicPadding = "";
  // if (variant === "default" || variant === "destructive") {
  //   // if active state is on, adjust padding
  // }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
