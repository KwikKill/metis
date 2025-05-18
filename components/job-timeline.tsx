"use client"

import { useEffect, useState } from "react"
import { addTimelineEvent, getTimelineEventsByJobId, type TimelineEvent } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, PlusCircle } from "lucide-react"

interface JobTimelineProps {
  jobId: string
}

const timelineFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
})

type TimelineFormValues = z.infer<typeof timelineFormSchema>

export function JobTimeline({ jobId }: JobTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  })

  useEffect(() => {
    // Load timeline events from localStorage
    const timelineEvents = getTimelineEventsByJobId(jobId)

    // Sort by date (newest first)
    timelineEvents.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setEvents(timelineEvents)
  }, [jobId])

  const onSubmit = (data: TimelineFormValues) => {
    const newEvent = addTimelineEvent({
      jobId,
      title: data.title,
      date: data.date,
      description: data.description,
    })

    // Add to state and sort
    const updatedEvents = [newEvent, ...events]
    updatedEvents.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setEvents(updatedEvents)

    toast({
      title: "Event added",
      description: "Timeline event has been added successfully.",
    })

    form.reset()
    setIsDialogOpen(false)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Event</DialogTitle>
              <DialogDescription>Add a new event to the job application timeline.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Interview" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details about the event..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Event</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {events.length > 0 ? (
        <div className="relative space-y-4 pl-6 before:absolute before:inset-y-0 before:left-2 before:w-[1px] before:bg-border">
          {events.map((event) => (
            <div key={event.id} className="relative pb-4">
              <div className="absolute -left-[23px] h-4 w-4 rounded-full bg-primary"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium leading-none">{event.title}</h4>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No timeline events"
          description="Add events to track the progress of your application."
          className="py-8"
          action={
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Event
            </Button>
          }
        />
      )}
    </div>
  )
}
