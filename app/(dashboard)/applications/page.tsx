import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { JobsTable } from "@/components/jobs-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Applications" text="Manage all your job applications">
      </DashboardHeader>
      <JobsTable />
    </DashboardShell>
  )
}
