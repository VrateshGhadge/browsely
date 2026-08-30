import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function TestPage() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in")
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>You are authenticated.</p>
    </div>
  )
}