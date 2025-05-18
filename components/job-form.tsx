"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { addJob, updateJob, type Job, type JobStatus } from "@/lib/local-storage"
import { addTimelineEvent } from "@/lib/local-storage"

const formSchema = z.object({
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  url: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  salary: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .email({
      message: "Please enter a valid email.",
    })
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface JobFormProps {
  job?: Job
}

export function JobForm({ job }: JobFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditing = !!job

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: job?.company || "",
      position: job?.position || "",
      location: job?.location || "",
      status: job?.status || "Applied",
      url: job?.url || "",
      description: job?.description || "",
      salary: job?.salary || "",
      contactName: job?.contactName || "",
      contactEmail: job?.contactEmail || "",
      notes: "",
    },
  })

  function onSubmit(values: FormValues) {
    let newJob: Job | undefined = undefined // Declare newJob variable

    if (isEditing && job) {
      // Update existing job
      const previousStatus = job.status
      const updatedJob = updateJob({
        ...job,
        ...values,
      })

      // Add timeline event if status changed
      if (previousStatus !== values.status) {
        addTimelineEvent({
          jobId: job.id,
          title: `Status changed to ${values.status}`,
          date: new Date().toISOString().split("T")[0],
          description: `Status updated from ${previousStatus} to ${values.status}`,
        })
      }

      toast({
        title: "Job updated",
        description: "Your job application has been successfully updated.",
      })

      // Redirect to the job detail page
      router.push(`/dashboard/job/${job.id}`)
    } else {
      // Add new job
      newJob = addJob({
        company: values.company,
        position: values.position,
        location: values.location,
        status: values.status as JobStatus,
        salary: values.salary || "",
        url: values.url || "",
        description: values.description || "",
        contactName: values.contactName || "",
        contactEmail: values.contactEmail || "",
      })

      // Add initial timeline event
      addTimelineEvent({
        jobId: newJob.id,
        title: "Application Created",
        date: new Date().toISOString().split("T")[0],
        description: `Applied for ${values.position} at ${values.company}`,
      })

      // Add note if provided
      if (values.notes) {
        addTimelineEvent({
          jobId: newJob.id,
          title: "Initial Notes",
          date: new Date().toISOString().split("T")[0],
          description: values.notes,
        })
      }

      toast({
        title: "Job application added",
        description: "Your job application has been successfully added.",
      })

      // Redirect to the job detail page with the new job ID
      router.push(`/dashboard/job/${newJob.id}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Google" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Mountain View, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Saved">Saved</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://careers.google.com/jobs/123" {...field} />
                </FormControl>
                <FormDescription>The URL of the job posting.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="$100,000 - $120,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.smith@google.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the job description here..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditing && (
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any personal notes about this application..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update" : "Save"} Application</Button>
        </div>
      </form>
    </Form>
  )
}
