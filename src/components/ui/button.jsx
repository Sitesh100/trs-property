import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-[#F5EFE7] shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Golden/Amber themed button like "Post Property Free"
        golden:
          "bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] font-semibold border border-[#C6A256]/50 shadow-md hover:shadow-[0_0_20px_rgba(198, 162, 86, 0.5)] hover:text-[#F5EFE7] transition-all duration-300",
        // Filter button styled like Post Property Free
        filter:
          "bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] font-semibold border border-[#C6A256]/50 shadow-md hover:shadow-[0_0_20px_rgba(198, 162, 86, 0.5)] hover:text-[#F5EFE7] transition-all duration-300",
        // Filter outline style
        filterOutline:
          "border-2 border-[#C6A256] text-[#C6A256] bg-transparent font-semibold hover:bg-[#212121]/10 hover:text-[#F5EFE7] transition-all duration-300",
        // Filter ghost style
        filterGhost:
          "text-[#F5EFE7]/70 font-medium hover:text-[#F5EFE7] hover:bg-[#F5EFE7]/10 transition-all duration-300",
        // Purple/Violet themed buttons
        purple:
          "bg-[#212121] text-[#F5EFE7] font-semibold shadow-lg hover:bg-[#212121] hover:shadow-[0_4px_20px_rgba(10, 31, 61, 0.5)] transition-all duration-300",
        purpleOutline:
          "border-2 border-[#212121] text-[#212121] bg-transparent font-semibold hover:bg-[#212121] hover:text-[#F5EFE7] transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants }