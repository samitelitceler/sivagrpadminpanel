import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border border-gray-400 file:text-foreground placeholder:text-muted-foreground  flex h-9 w-full min-w-0 rounded-md  bg-transparent px-3 py-1 text-base  outline-none file:inline-flex file:h-7 file:-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
