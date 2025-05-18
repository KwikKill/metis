"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PlusCircle, Building2, ExternalLink, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { addCompany, deleteCompany, getCompanies, getJobs, updateCompany } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/hooks/use-toast"
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

const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid URL").or(z.literal("")),
  notes: z.string().optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<any>(null)
  const { toast } = useToast()

  const addForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      website: "",
      notes: "",
    },
  })

  const editForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      website: "",
      notes: "",
    },
  })

  useEffect(() => {
    // Load companies and jobs
    const allCompanies = getCompanies()
    const allJobs = getJobs()

    setCompanies(allCompanies)
    setJobs(allJobs)
  }, [])

  const onAddSubmit = (data: CompanyFormValues) => {
    const newCompany = addCompany(data)
    setCompanies([...companies, newCompany])

    toast({
      title: "Company added",
      description: "The company has been added successfully.",
    })

    addForm.reset()
    setIsAddDialogOpen(false)
  }

  const onEditSubmit = (data: CompanyFormValues) => {
    if (editingCompany) {
      const updated = updateCompany({
        ...editingCompany,
        ...data,
      })

      setCompanies(companies.map((company) => (company.id === updated.id ? updated : company)))

      toast({
        title: "Company updated",
        description: "The company has been updated successfully.",
      })

      setIsEditDialogOpen(false)
    }
  }

  const handleEdit = (company: any) => {
    setEditingCompany(company)
    editForm.reset({
      name: company.name,
      website: company.website || "",
      notes: company.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteCompany(id)
    setCompanies(companies.filter((company) => company.id !== id))

    toast({
      title: "Company deleted",
      description: "The company has been deleted successfully.",
    })
  }

  // Count jobs for each company
  const getJobCount = (companyName: string) => {
    return jobs.filter((job) => job.company.toLowerCase() === companyName.toLowerCase()).length
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Companies" text="Manage companies you're applying to">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
              <DialogDescription>Add a new company to your tracker.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://google.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any notes about this company..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Company</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>Update company information.</DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Company</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>
                  {getJobCount(company.name)} application{getJobCount(company.name) !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {company.notes && <p className="text-sm text-muted-foreground">{company.notes}</p>}
              </CardContent>
              <CardFooter className="flex flex-col justify-between gap-2">
                <div className="flex gap-2 justify-between items-center w-full">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(company)} className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
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
                          This will delete the company. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(company.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {company.website && (
                  <Button variant="secondary" size="sm" asChild className="w-full">
                    <Link href={company.website} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No companies added"
          description="Add companies to keep track of where you're applying."
          action={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          }
        />
      )}
    </DashboardShell>
  )
}
