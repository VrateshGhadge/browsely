"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
// ----------------------------
      if (typeof (event as Partial<KeyboardEvent>).key !== "string") {
        const e = event as Event & { key?: unknown; code?: unknown; isTrusted?: boolean }
        const props: Record<string, unknown> = {}
        for (const name in e) {
          props[name] = (e as unknown as Record<string, unknown>)[name]
        }
        console.warn("[theme-hotkey] non-string event.key", {
          type: e.type,
          ctor: e.constructor?.name,
          key: e.key,
          code: e.code,
          isTrusted: e.isTrusted,
          target: e.target,
          props,
          stack: new Error().stack,
        })
        void fetch("http://localhost:7717/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: e.type,
            ctor: e.constructor?.name,
            proto: Object.getPrototypeOf(Object.getPrototypeOf(e))?.constructor?.name,
            key: e.key,
            code: e.code,
            isTrusted: e.isTrusted,
            target:
              e.target instanceof HTMLElement
                ? `${e.target.tagName}.${e.target.className?.toString().slice(0, 80)}`
                : String(e.target),
            props,
            stack: new Error().stack,
          }),
        })
        return
      }
// ----------------------
      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
