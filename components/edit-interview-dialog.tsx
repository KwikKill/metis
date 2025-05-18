"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { getInterview, getJobs, updateInterview } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { Edit } from "lucide-react"

interface EditInterviewDialogProps {
  interviewId: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const interviewFormSchema = z.object({
  jobId: z.string({
    required_error: "Please select a job.",
  }),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
})

type InterviewFormValues = z.infer<typeof interviewFormSchema>

export function EditInterviewDialog({ interviewId, onSuccess, trigger }: EditInterviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const { toast } = useToast()

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      jobId: "",
      title: "",
      date: "",
      time: "",
      notes: "",
    },
  })

  useEffect(() => {
    // Load jobs for the dropdown
    const allJobs = getJobs()
    setJobs(allJobs)

    // Load interview data
    const interview = getInterview(interviewId)
    if (interview) {
      form.reset({
        jobId: interview.jobId,
        title: interview.title,
        date: interview.date,
        time: interview.time,
        notes: interview.notes || "",
      })
    }
  }, [interviewId, form, isOpen])

  const onSubmit = (data: InterviewFormValues) => {
    const interview = getInterview(interviewId)
    if (interview) {
      updateInterview({
        ...interview,
        ...data,
      })

      toast({
        title: "Interview updated",
        description: "The interview has been updated successfully.",
      })

      setIsOpen(false)

      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogDescription>Update interview details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.position} at {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Technical Interview" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any notes about this interview..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Update Interview</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
