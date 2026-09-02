import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
// import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from "@clerk/ui/themes"

import "@clerk/ui/themes/shadcn.css"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body suppressHydrationWarning>
        <ClerkProvider appearance={{ theme: shadcn }} >
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  )
}