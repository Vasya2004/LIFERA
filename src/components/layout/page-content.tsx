import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PageContentProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

type PageGridProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageContent({ children, className = "", ...props }: PageContentProps) {
  return (
    <section
      className={joinClasses(
        "app-page grid content-start gap-5 overflow-x-hidden pt-6 pb-8 xl:gap-6 xl:pb-10",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function PageGrid({ children, className = "", ...props }: PageGridProps) {
  return (
    <div
      className={joinClasses("grid min-w-0 grid-cols-12 gap-5 xl:gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
