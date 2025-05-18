// Type definitions for our data
export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Saved"

export interface Job {
  id: string
  company: string
  position: string
  status: JobStatus
  location: string
  date: string
  salary: string
  url?: string
  description?: string
  contactName?: string
  contactEmail?: string
}

export interface Note {
  id: string
  jobId: string
  content: string
  date: string
}

export interface TimelineEvent {
  id: string
  jobId: string
  title: string
  date: string
  description: string
}

export interface Interview {
  id: string
  jobId: string
  title: string
  date: string
  time: string
  notes?: string
}

export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  notes?: string
}

export interface Company {
  id: string
  name: string
  website?: string
  notes?: string
}

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Local storage keys
const JOBS_STORAGE_KEY = "metis_jobs"
const NOTES_STORAGE_KEY = "metis_notes"
const TIMELINE_STORAGE_KEY = "metis_timeline"
const INTERVIEWS_STORAGE_KEY = "metis_interviews"
const CONTACTS_STORAGE_KEY = "metis_contacts"
const COMPANIES_STORAGE_KEY = "metis_companies"

// Generic function to get data from localStorage
function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return []
  }
}

// Generic function to save data to localStorage
function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Jobs
export function getJobs(): Job[] {
  return getFromStorage<Job>(JOBS_STORAGE_KEY)
}

export function saveJobs(jobs: Job[]): void {
  saveToStorage(JOBS_STORAGE_KEY, jobs)
}

export function addJob(job: Omit<Job, "id" | "date">): Job {
  const newJob: Job = {
    ...job,
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
  }

  const jobs = getJobs()
  jobs.push(newJob)
  saveJobs(jobs)

  return newJob
}

export function updateJob(updatedJob: Job): Job {
  const jobs = getJobs()
  const index = jobs.findIndex((job) => job.id === updatedJob.id)

  if (index !== -1) {
    jobs[index] = updatedJob
    saveJobs(jobs)
  }

  return updatedJob
}

export function deleteJob(id: string): void {
  const jobs = getJobs()
  const filteredJobs = jobs.filter((job) => job.id !== id)
  saveJobs(filteredJobs)

  // Also delete related data
  deleteNotesByJobId(id)
  deleteTimelineEventsByJobId(id)
  deleteInterviewsByJobId(id)
}

export function getJob(id: string): Job | undefined {
  const jobs = getJobs()
  return jobs.find((job) => job.id === id)
}

// Notes
export function getNotes(): Note[] {
  return getFromStorage<Note>(NOTES_STORAGE_KEY)
}

export function getNotesByJobId(jobId: string): Note[] {
  const notes = getNotes()
  return notes.filter((note) => note.jobId === jobId)
}

export function saveNotes(notes: Note[]): void {
  saveToStorage(NOTES_STORAGE_KEY, notes)
}

export function addNote(jobId: string, content: string): Note {
  const newNote: Note = {
    id: generateId(),
    jobId,
    content,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }

  const notes = getNotes()
  notes.push(newNote)
  saveNotes(notes)

  return newNote
}

export function deleteNotesByJobId(jobId: string): void {
  const notes = getNotes()
  const filteredNotes = notes.filter((note) => note.jobId !== jobId)
  saveNotes(filteredNotes)
}

// Timeline Events
export function getTimelineEvents(): TimelineEvent[] {
  return getFromStorage<TimelineEvent>(TIMELINE_STORAGE_KEY)
}

export function getTimelineEventsByJobId(jobId: string): TimelineEvent[] {
  const events = getTimelineEvents()
  return events.filter((event) => event.jobId === jobId)
}

export function saveTimelineEvents(events: TimelineEvent[]): void {
  saveToStorage(TIMELINE_STORAGE_KEY, events)
}

export function addTimelineEvent(event: Omit<TimelineEvent, "id">): TimelineEvent {
  const newEvent: TimelineEvent = {
    ...event,
    id: generateId(),
  }

  const events = getTimelineEvents()
  events.push(newEvent)
  saveTimelineEvents(events)

  return newEvent
}

export function deleteTimelineEventsByJobId(jobId: string): void {
  const events = getTimelineEvents()
  const filteredEvents = events.filter((event) => event.jobId !== jobId)
  saveTimelineEvents(filteredEvents)
}

// Interviews
export function getInterviews(): Interview[] {
  return getFromStorage<Interview>(INTERVIEWS_STORAGE_KEY)
}

export function getInterviewsByJobId(jobId: string): Interview[] {
  const interviews = getInterviews()
  return interviews.filter((interview) => interview.jobId === jobId)
}

export function getUpcomingInterviews(limit?: number): Interview[] {
  const interviews = getInterviews()
  const now = new Date()

  // Filter interviews that are in the future
  const upcomingInterviews = interviews.filter((interview) => {
    const interviewDate = new Date(`${interview.date}T${interview.time}`)
    return interviewDate > now
  })

  // Sort by date (closest first)
  upcomingInterviews.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Return limited number if specified
  return limit ? upcomingInterviews.slice(0, limit) : upcomingInterviews
}

export function saveInterviews(interviews: Interview[]): void {
  saveToStorage(INTERVIEWS_STORAGE_KEY, interviews)
}

export function addInterview(interview: Omit<Interview, "id">): Interview {
  const newInterview: Interview = {
    ...interview,
    id: generateId(),
  }

  const interviews = getInterviews()
  interviews.push(newInterview)
  saveInterviews(interviews)

  return newInterview
}

export function updateInterview(updatedInterview: Interview): Interview {
  const interviews = getInterviews()
  const index = interviews.findIndex((interview) => interview.id === updatedInterview.id)

  if (index !== -1) {
    interviews[index] = updatedInterview
    saveInterviews(interviews)
  }

  return updatedInterview
}

export function deleteInterviewsByJobId(jobId: string): void {
  const interviews = getInterviews()
  const filteredInterviews = interviews.filter((interview) => interview.jobId !== jobId)
  saveInterviews(filteredInterviews)
}

export function deleteInterview(id: string): void {
  const interviews = getInterviews()
  const filteredInterviews = interviews.filter((interview) => interview.id !== id)
  saveInterviews(filteredInterviews)
}

export function getInterview(id: string): Interview | undefined {
  const interviews = getInterviews()
  return interviews.find((interview) => interview.id === id)
}

// Contacts
export function getContacts(): Contact[] {
  return getFromStorage<Contact>(CONTACTS_STORAGE_KEY)
}

export function saveContacts(contacts: Contact[]): void {
  saveToStorage(CONTACTS_STORAGE_KEY, contacts)
}

export function addContact(contact: Omit<Contact, "id">): Contact {
  const newContact: Contact = {
    ...contact,
    id: generateId(),
  }

  const contacts = getContacts()
  contacts.push(newContact)
  saveContacts(contacts)

  return newContact
}

export function updateContact(updatedContact: Contact): Contact {
  const contacts = getContacts()
  const index = contacts.findIndex((contact) => contact.id === updatedContact.id)

  if (index !== -1) {
    contacts[index] = updatedContact
    saveContacts(contacts)
  }

  return updatedContact
}

export function deleteContact(id: string): void {
  const contacts = getContacts()
  const filteredContacts = contacts.filter((contact) => contact.id !== id)
  saveContacts(filteredContacts)
}

// Companies
export function getCompanies(): Company[] {
  return getFromStorage<Company>(COMPANIES_STORAGE_KEY)
}

export function saveCompanies(companies: Company[]): void {
  saveToStorage(COMPANIES_STORAGE_KEY, companies)
}

export function addCompany(company: Omit<Company, "id">): Company {
  const newCompany: Company = {
    ...company,
    id: generateId(),
  }

  const companies = getCompanies()
  companies.push(newCompany)
  saveCompanies(companies)

  return newCompany
}

export function updateCompany(updatedCompany: Company): Company {
  const companies = getCompanies()
  const index = companies.findIndex((company) => company.id === updatedCompany.id)

  if (index !== -1) {
    companies[index] = updatedCompany
    saveCompanies(companies)
  }

  return updatedCompany
}

export function deleteCompany(id: string): void {
  const companies = getCompanies()
  const filteredCompanies = companies.filter((company) => company.id !== id)
  saveCompanies(filteredCompanies)
}

// Stats
export function getJobStats() {
  const jobs = getJobs()

  const totalApplications = jobs.length
  const interviews = jobs.filter((job) => job.status === "Interview").length
  const offers = jobs.filter((job) => job.status === "Offer").length
  const rejections = jobs.filter((job) => job.status === "Rejected").length

  // Calculate month-over-month changes
  const today = new Date()
  const lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const thisMonthJobs = jobs.filter((job) => {
    const jobDate = new Date(job.date)
    return jobDate >= lastMonth && jobDate <= today
  })

  const thisMonthApplications = thisMonthJobs.length
  const thisMonthInterviews = thisMonthJobs.filter((job) => job.status === "Interview").length
  const thisMonthOffers = thisMonthJobs.filter((job) => job.status === "Offer").length
  const thisMonthRejections = thisMonthJobs.filter((job) => job.status === "Rejected").length

  return {
    totalApplications,
    interviews,
    offers,
    rejections,
    thisMonthApplications,
    thisMonthInterviews,
    thisMonthOffers,
    thisMonthRejections,
  }
}

// Get monthly application data for charts
export function getMonthlyApplicationData() {
  const jobs = getJobs()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentYear = new Date().getFullYear()

  // Initialize data structure
  const monthlyData = months.map((month) => ({
    name: month,
    applied: 0,
    interviews: 0,
    offers: 0,
  }))

  // Populate with actual data
  jobs.forEach((job) => {
    const jobDate = new Date(job.date)

    // Only count jobs from current year
    if (jobDate.getFullYear() === currentYear) {
      const monthIndex = jobDate.getMonth()

      // Increment the appropriate counter
      monthlyData[monthIndex].applied++

      if (job.status === "Interview") {
        monthlyData[monthIndex].interviews++
      } else if (job.status === "Offer") {
        monthlyData[monthIndex].offers++
      }
    }
  })

  return monthlyData
}
