"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Sidebar } from "../../(auth)/sidebar";

type Props = {
  children: React.ReactNode;
};

const MIN_SIDEBAR_WIDTH = 180;
const DEFAULT_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 420;

export function StoreLayoutShell({ children }: Props) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

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

  return (
    <div
      className="flex min-h-svh bg-zinc-50 dark:bg-black"
      style={
        {
          "--store-sidebar-width": `${sidebarWidth}px`,
        } as React.CSSProperties
      }
    >
      <div className="fixed inset-y-0 left-0 hidden w-[var(--store-sidebar-width)] border-r bg-white lg:block">
        <Sidebar />

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

      <main className="flex w-full pb-2 transition-[padding] duration-150 lg:pl-[var(--store-sidebar-width)] lg:pr-4 lg:pt-2">
        <div className="grow bg-white lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5">
          {children}
        </div>
      </main>
    </div>
  );
}
