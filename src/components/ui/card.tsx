import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "theme-card rounded-[28px] border backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}
