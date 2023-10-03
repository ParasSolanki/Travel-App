import React from "react";
import { cn } from "~/lib/utils";

export function SectionHeader({
  title,
  description,
  className,
  right,
}: {
  title: string;
  description?: string;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex-grow-1 mr-2">
        <h2 className="font-cal-sans text-4xl font-bold text-foreground md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {right && <div className="mt-2 sm:mt-0">{right}</div>}
    </div>
  );
}
