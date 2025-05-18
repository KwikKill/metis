"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addNote, getNotesByJobId, type Note } from "@/lib/local-storage"
import { EmptyState } from "@/components/empty-state"
import { FileText } from "lucide-react"

interface JobNotesProps {
  jobId: string
}

export function JobNotes({ jobId }: JobNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load notes from localStorage
    const jobNotes = getNotesByJobId(jobId)
    setNotes(jobNotes)
  }, [jobId])

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note = addNote(jobId, newNote)
    setNotes([note, ...notes])
    setNewNote("")

    toast({
      title: "Note added",
      description: "Your note has been added successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddNote} className="w-full">
          Add Note
        </Button>
      </div>

      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border p-4">
              <p className="mb-2 text-sm whitespace-pre-line">{note.content}</p>
              <p className="text-xs text-muted-foreground">{note.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Add your first note to keep track of important information."
          className="py-8"
        />
      )}
    </div>
  )
}
