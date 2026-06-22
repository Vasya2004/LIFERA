"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DropdownMenuProps = {
  children: ReactNode;
};

type DropdownMenuTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
};

type DropdownMenuContentProps = {
  align?: "start" | "end";
  children: ReactNode;
  className?: string;
};

type DropdownMenuItemProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}>({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpenRaw] = useState(false);
  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setOpenRaw(value);
  }, []);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
        // @ts-expect-error -- forwarding original onClick from child
        children.props.onClick?.(e);
      },
    });
  }

  return <div onClick={() => setOpen((prev) => !prev)}>{children}</div>;
}

export function DropdownMenuContent({
  align = "start",
  children,
  className = "",
}: DropdownMenuContentProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, open]);

  if (!open) return null;

  return (
    <div
      className={[
        "absolute top-full z-40 mt-2 min-w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-900",
        align === "end" ? "right-0" : "left-0",
        className,
      ].join(" ")}
      ref={containerRef}
      role="menu"
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className = "", onClick }: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <button
      className={[
        "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
        className,
      ].join(" ")}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      role="menuitem"
      type="button"
    >
      {children}
    </button>
  );
}
