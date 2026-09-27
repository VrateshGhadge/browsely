"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { tasks } from "@trigger.dev/sdk";
import type { helloWorldTask } from "@/trigger/example"

import { createWorkflow } from "@/features/workflows/data"

export async function createWorkflowAction(name: string) {
    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }

    const workflow = await createWorkflow(orgId, name)

    revalidatePath("/workflows", "layout")
    redirect(`/workflows/${workflow.id}`)
}

   

export async function runWorkflowAction(name: string) {

    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }
     const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
        message: "Hello from the right sidebar!",
     })

     return handle
}