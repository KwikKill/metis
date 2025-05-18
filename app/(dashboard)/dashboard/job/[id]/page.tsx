"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { CalendarDays, Edit, ExternalLink, FileText, MapPin, Trash } from "lucide-react"
import Link from "next/link"
import { JobNotes } from "@/components/job-notes"
import { JobTimeline } from "@/components/job-timeline"
import { deleteInterview, deleteJob, getInterviewsByJobId, getJob, type Job } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/empty-state"
import { AddInterviewDialog } from "@/components/add-interview-dialog"
import { EditInterviewDialog } from "@/components/edit-interview-dialog"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [interviews, setInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params; // Unwrap the Promise
        const jobData = getJob(resolvedParams.id);
        if (jobData) {
          setJob(jobData);
        } else {
          console.error(`Job with ID ${resolvedParams.id} not found`);
        }

        const jobInterviews = getInterviewsByJobId(resolvedParams.id);
        setInterviews(jobInterviews);
      } catch (error) {
        console.error("Error resolving params:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleDelete = () => {
    if (job) {
      deleteJob(job.id)
      toast({
        title: "Job deleted",
        description: "The job application has been deleted successfully.",
      })
      router.push("/dashboard")
    }
  }

  const handleDeleteInterview = (id: string) => {
    deleteInterview(id)

    // Update the interviews list
    setInterviews(interviews.filter((interview) => interview.id !== id))

    toast({
      title: "Interview deleted",
      description: "The interview has been deleted successfully.",
    })
  }

  const refreshInterviews = () => {
    if (job) {
      setInterviews(getInterviewsByJobId(job.id))
    }
  }

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
          description="The job application you're looking for doesn't exist or has been deleted."
          action={
            <Link href="/dashboard">
              <Button>Go back to Dashboard</Button>
            </Link>
          }
        />
      </DashboardShell>
    )
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
      case "Interview":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700"
      case "Offer":
        return "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
      case "Rejected":
        return "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
      case "Saved":
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={job.position} text={job.company}>
        <div className="flex space-x-2">
          <Link href={`/dashboard/job/${job.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this job application and all associated data. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Details about the position and company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="gap-1 flex flex-col">
                <b className="font-medium">Status</b>
                <Badge variant="outline" className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
              <div className="gap-1 flex flex-col">
                <b className="font-medium">Applied On</b>
                <p className="text-sm">{new Date(job.date).toLocaleDateString()}</p>
              </div>
              <div className="gap -1 flex flex-col">
                <b className="font-medium">Salary Range</b>
                <p className="text-sm">{job.salary || "Not specified"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <b className="font-medium">Location</b>
              <div className="flex items-center text-sm">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                {job.location}
              </div>
            </div>

            {job.description && (
              <div className="space-y-1">
                <b className="font-medium">Job Description</b>
                <p className="text-sm whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {(job.contactName || job.contactEmail) && (
              <div className="space-y-1">
                <b className="font-medium">Contact Information</b>
                <div className="text-sm">
                  {job.contactName && <p>{job.contactName}</p>}
                  {job.contactEmail && <p>{job.contactEmail}</p>}
                </div>
              </div>
            )}

            {job.url && (
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={job.url} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Job Posting
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Interviews</CardTitle>
              <AddInterviewDialog jobId={job.id} onSuccess={refreshInterviews} />
            </CardHeader>
            <CardContent>
              {interviews.length > 0 ? (
                <div className="space-y-4">
                  {interviews.map((interview) => {
                    const interviewDate = new Date(`${interview.date}T${interview.time}`)
                    const formattedDate = interviewDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    const formattedTime = interviewDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })

                    return (
                      <div key={interview.id} className="flex flex-col">
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{interview.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formattedDate} at {formattedTime}
                            </p>
                          </div>
                        </div>
                        {interview.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{interview.notes}</p>
                        )}
                        <div className="flex space-x-2 mt-2 w-full">
                          <EditInterviewDialog
                            interviewId={interview.id}
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
                                <AlertDialogAction onClick={() => handleDeleteInterview(interview.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="No interviews scheduled"
                  description="Schedule interviews to keep track of your progress."
                  className="py-8"
                />
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="notes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                <FileText className="mr-2 h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <CalendarDays className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  <JobNotes jobId={job.id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline">
              <Card>
                <CardContent className="pt-6">
                  <JobTimeline jobId={job.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
