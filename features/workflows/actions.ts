"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { tasks } from "@trigger.dev/sdk";
import type { helloWorldTask } from "@/trigger/example"

import { liveblocks } from "@/lib/liveblocks"

import { createWorkflow, deleteWorkflow } from "@/features/workflows/data"

export async function createWorkflowAction(name: string) {
    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }

    const workflow = await createWorkflow(orgId, name)

    revalidatePath("/workflows", "layout")
    redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(id:string) {
    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }

    const workflow = await deleteWorkflow(orgId, id)
    if(!workflow) {
        throw new Error("Workflow not found")
    }

    //while deleting a workflow, we need to delete the liveblocks room associated with it
    //beause Liveblocks room ID is the same as the workflow ID. so When the user clicks Delete workflow, you need to remove both.
    await liveblocks.deleteRoom(workflow.id)

    revalidatePath("/", "layout")
    redirect(`/`)
}
   

export async function runWorkflowAction() {

    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }
     const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
        message: "Hello from the right sidebar!",
     })

     return handle
}