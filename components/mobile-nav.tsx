"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BriefcaseBusiness, Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <BriefcaseBusiness className="mr-2 h-6 w-6" />
          <span className="font-bold">Metis</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink
              href="/dashboard"
              className={cn(pathname === "/dashboard" ? "text-foreground" : "text-foreground/60")}
              onOpenChange={setOpen}
            >
              Dashboard
            </MobileLink>
            <MobileLink
              href="/applications"
              className={cn(pathname === "/applications" ? "text-foreground" : "text-foreground/60")}
              onOpenChange={setOpen}
            >
              Applications
            </MobileLink>
            <MobileLink
              href="/interviews"
              className={cn(pathname === "/interviews" ? "text-foreground" : "text-foreground/60")}
              onOpenChange={setOpen}
            >
              Interviews
            </MobileLink>
            <MobileLink
              href="/companies"
              className={cn(pathname === "/companies" ? "text-foreground" : "text-foreground/60")}
              onOpenChange={setOpen}
            >
              Companies
            </MobileLink>
            <MobileLink
              href="/contacts"
              className={cn(pathname === "/contacts" ? "text-foreground" : "text-foreground/60")}
              onOpenChange={setOpen}
            >
              Contacts
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link href={href} onClick={() => onOpenChange?.(false)} className={cn(className)} {...props}>
      {children}
    </Link>
  )
}
