import Link from "next/link"
import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard
  redirect("/dashboard")

  return (
    <div>
      <h1>Metis - Job Tracker</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  )
}
