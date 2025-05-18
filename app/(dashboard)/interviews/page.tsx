"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, ChevronDown, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { deleteInterview, getInterviews, getJobs } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddInterviewDialog } from "@/components/add-interview-dialog"
import { EditInterviewDialog } from "@/components/edit-interview-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load interviews and jobs
    const allInterviews = getInterviews()
    const allJobs = getJobs()

    setInterviews(allInterviews)
    setJobs(allJobs)
    setFilteredInterviews(allInterviews)
  }, [])

  useEffect(() => {
    // Filter interviews based on search query and selected status
    let filtered = interviews

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((interview) => {
        const job = jobs.find((j) => j.id === interview.jobId)
        return (
          interview.title.toLowerCase().includes(query) ||
          (job && job.company.toLowerCase().includes(query)) ||
          (job && job.position.toLowerCase().includes(query))
        )
      })
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter((interview) => {
        const job = jobs.find((j) => j.id === interview.jobId)
        return job && selectedStatus.includes(job.status)
      })
    }

    setFilteredInterviews(filtered)
  }, [searchQuery, selectedStatus, interviews, jobs])

  const handleDeleteInterview = (id: string) => {
    deleteInterview(id)

    // Update the interviews list
    const updatedInterviews = interviews.filter((interview) => interview.id !== id)
    setInterviews(updatedInterviews)

    toast({
      title: "Interview deleted",
      description: "The interview has been deleted successfully.",
    })
  }

  const refreshInterviews = () => {
    setInterviews(getInterviews())
  }

  // Group interviews by date
  const groupedInterviews = filteredInterviews.reduce(
    (groups, interview) => {
      const date = interview.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(interview)
      return groups
    },
    {} as Record<string, any[]>,
  )

  // Sort dates
  const sortedDates = Object.keys(groupedInterviews).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Interviews" text="Manage your upcoming and past interviews">
        <AddInterviewDialog onSuccess={refreshInterviews} />
      </DashboardHeader>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["Applied", "Interview", "Offer", "Rejected", "Saved"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatus.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStatus([...selectedStatus, status])
                  } else {
                    setSelectedStatus(selectedStatus.filter((s) => s !== status))
                  }
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredInterviews.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-lg font-medium mb-3">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedInterviews[date].map((interview: { jobId: any; id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; date: any; time: any; notes: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => {
                  const job = jobs.find((j) => j.id === interview.jobId)
                  return (
                    <Card key={interview.id} className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{interview.title}</h4>
                            {job && (
                              <Link
                                href={`/dashboard/job/${job.id}`}
                                className="text-sm text-muted-foreground hover:underline"
                              >
                                {job.company} - {job.position}
                              </Link>
                            )}
                          </div>
                          <div className="text-sm text-right">
                            {new Date(`${interview.date}T${interview.time}`).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        {interview.notes && <p className="text-sm mt-2 text-muted-foreground">{interview.notes}</p>}
                        <div className="mt-auto pt-4 flex flex-col justify-between gap-2">
                          <div className="flex gap-2 justify-between items-center">
                            <EditInterviewDialog
                              interviewId={interview.id ? String(interview.id) : ""}
                              onSuccess={refreshInterviews}
                              trigger={
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              }
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this interview. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteInterview(String(interview.id))}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <Link href={`/dashboard/job/${interview.jobId}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              View Job
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No interviews found"
          description={
            searchQuery || selectedStatus.length > 0
              ? "Try adjusting your search or filters"
              : "Schedule your first interview to get started"
          }
          action={<AddInterviewDialog onSuccess={refreshInterviews} />}
        />
      )}
    </DashboardShell>
  )
}
