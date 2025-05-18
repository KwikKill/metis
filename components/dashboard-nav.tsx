"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { BarChart3, BriefcaseBusiness, Calendar, FileText, Users } from "lucide-react"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export function DashboardNav({ className, items, ...props }: NavProps) {
  const pathname = usePathname()

  const defaultItems = [
    {
      href: "/dashboard",
      title: "Overview",
      icon: BarChart3,
    },
    {
      href: "/applications",
      title: "Applications",
      icon: FileText,
    },
    {
      href: "/interviews",
      title: "Interviews",
      icon: Calendar,
    },
    {
      href: "/companies",
      title: "Companies",
      icon: BriefcaseBusiness,
    },
    {
      href: "/contacts",
      title: "Contacts",
      icon: Users,
    },
  ]

  const navItems = items || defaultItems

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
