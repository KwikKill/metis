import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { JobForm } from "@/components/job-form"

export default function NewJobPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add New Application" text="Enter the details of your new job application" />
      <div className="grid gap-8">
        <JobForm />
      </div>
    </DashboardShell>
  )
}
