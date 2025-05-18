"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { JobForm } from "@/components/job-form"
import { getJob, type Job } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditJobPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch job details
    const jobData = getJob(params.id)
    if (jobData) {
      setJob(jobData)
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!job) {
    return (
      <DashboardShell>
        <EmptyState
          title="Job not found"
          description="The job application you're trying to edit doesn't exist or has been deleted."
          action={
            <Link href="/dashboard">
              <Button>Go back to Dashboard</Button>
            </Link>
          }
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Application" text={`Editing ${job.position} at ${job.company}`} />
      <div className="grid gap-8">
        <JobForm job={job} />
      </div>
    </DashboardShell>
  )
}
