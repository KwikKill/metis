"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Clock, FileText, PlusCircle, Users, XCircle } from "lucide-react"
import Link from "next/link"
import { JobsTable } from "@/components/jobs-table"
import { Overview } from "@/components/overview"
import { getJobStats, getUpcomingInterviews } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { AddInterviewDialog } from "@/components/add-interview-dialog"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
    thisMonthApplications: 0,
    thisMonthInterviews: 0,
    thisMonthOffers: 0,
    thisMonthRejections: 0,
  })

  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([])

  useEffect(() => {
    // Get stats from localStorage
    const jobStats = getJobStats()
    setStats(jobStats)

    // Get upcoming interviews
    const interviews = getUpcomingInterviews(3)
    setUpcomingInterviews(interviews)
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Track your job applications and interviews">
        <Link href="/dashboard/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Application
          </Button>
        </Link>
      </DashboardHeader>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.thisMonthApplications > 0
                    ? `+${stats.thisMonthApplications} this month`
                    : "No new applications this month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interviews}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.thisMonthInterviews > 0
                    ? `+${stats.thisMonthInterviews} this month`
                    : "No new interviews this month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.offers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.thisMonthOffers > 0 ? `+${stats.thisMonthOffers} this month` : "No new offers this month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejections</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejections}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.thisMonthRejections > 0
                    ? `+${stats.thisMonthRejections} this month`
                    : "No new rejections this month"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Your application progress over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>
                  {upcomingInterviews.length > 0
                    ? `You have ${upcomingInterviews.length} interview${
                        upcomingInterviews.length > 1 ? "s" : ""
                      } scheduled`
                    : "No upcoming interviews"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => {
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
                        <div key={interview.id} className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{interview.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formattedDate} at {formattedTime}
                            </p>
                          </div>
                          <Link href={`/dashboard/job/${interview.jobId}`}>
                            <Button variant="outline" size="sm">
                              <Clock className="mr-2 h-4 w-4" />
                              Prepare
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={CalendarDays}
                    title="No upcoming interviews"
                    description="When you schedule interviews, they'll appear here."
                    action={
                      <AddInterviewDialog
                        onSuccess={() => {
                          setUpcomingInterviews(getUpcomingInterviews(3))
                        }}
                      />
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="applications" className="space-y-4">
          <JobsTable />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
