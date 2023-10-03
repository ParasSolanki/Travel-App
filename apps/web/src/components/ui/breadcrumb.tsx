import React from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumbs as ReactAriaBreadcrumbs,
  Breadcrumb as ReactAriaBreadcrumb,
} from "react-aria-components";
import { cn } from "~/lib/utils";

export function Breadcrumbs({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ReactAriaBreadcrumbs
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      {children}
    </ReactAriaBreadcrumbs>
  );
}

export function Breadcrumb({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ReactAriaBreadcrumb
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      {children}
    </ReactAriaBreadcrumb>
  );
}

export function BreadcrumbLink({
  isLast = false,
  className,
  children,
}: React.PropsWithChildren<{
  isLast?: boolean;
  className?: string;
}>) {
  return (
    <>
      <span
        aria-disabled={isLast}
        className={cn(
          "font-semibold aria-disabled:text-muted-foreground/70 [&:not([aria-disabled='true'])]:text-muted-foreground [&:not([aria-disabled='true'])]:focus-within:rounded-sm [&:not([aria-disabled='true'])]:focus-within:text-primary [&:not([aria-disabled='true'])]:focus-within:outline-none [&:not([aria-disabled='true'])]:focus-within:ring-2 [&:not([aria-disabled='true'])]:focus-within:ring-primary [&:not([aria-disabled='true'])]:focus-within:ring-offset-2 [&:not([aria-disabled='true'])]:focus-within:ring-offset-background [&:not([aria-disabled='true'])]:hover:text-primary",
          className,
        )}
      >
        {children}
      </span>
      {!isLast && (
        <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
      )}
    </>
  );
}
