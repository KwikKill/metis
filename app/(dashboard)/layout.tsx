import type React from "react"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between p-4 w-full">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      {/* Main content */}
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex border-r">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-center border-t bg-background p-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Metis. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            <img src="/icon.svg" alt="Metis" className="h-4 w-4 inline-block mr-1" />
            Made by KwikKill
          </p>
        </div>
      </div>
    </div>
  )
}
