import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn's Button, retuned for The Climate Note: pill geometry, mono label and
 * the spruce/paper tokens rather than shadcn's default neutral palette. Sizes
 * start at 44px so every variant clears the minimum touch target.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-note text-sm transition-[background-color,color,border-color,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-bright",
        onDark: "bg-pine-ink text-[#0c1310] hover:bg-white",
        outline: "border border-line-strong text-ink hover:border-accent hover:text-accent",
        ghostOnDark:
          "border border-pine-ink/40 text-pine-ink hover:border-pine-ink hover:bg-pine-ink/10",
        link: "text-ink-2 underline-offset-4 hover:text-accent hover:underline",
      },
      size: {
        default: "min-h-11 px-5",
        lg: "min-h-12 px-6 text-[0.95rem]",
        pill: "min-h-11 px-4",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

/**
 * For navigation, don't wrap a Link in this — spread `buttonVariants(...)` onto
 * the Link itself so the element stays a real anchor for assistive tech.
 */
function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
