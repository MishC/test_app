"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  contentClassName?: string;
};

const MIN_SIDEBAR_WIDTH = 180;
const DEFAULT_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 420;

export function ResizableSidebarLayout({
  children,
  sidebar,
  contentClassName,
}: Props) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    function onPointerMove(event: PointerEvent) {
      const nextWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, event.clientX),
      );
      setSidebarWidth(nextWidth);
    }

    function onPointerUp() {
      setIsResizing(false);
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div
      className="flex min-h-svh bg-zinc-50 dark:bg-black"
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as React.CSSProperties
      }
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Open sidebar"
        className="fixed left-3 top-3 z-30 bg-white shadow-sm lg:hidden"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="size-4" />
      </Button>

      <button
        type="button"
        aria-label="Close sidebar backdrop"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          isMobileSidebarOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r bg-white transition-transform duration-200 lg:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          className="absolute right-2 top-2 z-10"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <X className="size-4" />
        </Button>
        {sidebar}
      </div>

      <div className="fixed inset-y-0 left-0 hidden w-[var(--sidebar-width)] border-r bg-white lg:block">
        {sidebar}

        <button
          type="button"
          aria-label="Resize sidebar"
          className={cn(
            "absolute inset-y-0 right-0 w-2 translate-x-1 cursor-col-resize border-r border-transparent hover:border-zinc-400",
            isResizing && "border-zinc-500 bg-zinc-100",
          )}
          onPointerDown={(event) => {
            event.preventDefault();
            setIsResizing(true);
          }}
        />
      </div>

      <main className="flex w-full pb-2 pt-14 transition-[padding] duration-150 lg:pl-[var(--sidebar-width)] lg:pr-4 lg:pt-2">
        <div
          className={cn(
            "grow bg-white lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5",
            contentClassName,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
