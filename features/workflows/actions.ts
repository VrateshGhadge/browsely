"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { tasks, runs } from "@trigger.dev/sdk";
import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"

import { liveblocks } from "@/lib/liveblocks"

import { createWorkflow, deleteWorkflow, saveWorkflowGraph } from "@/features/workflows/data"
import { WorkflowGraph } from "@/lib/db/schema"

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
   

export async function runWorkflowAction({
    id,
    graph
}:{
    id: string,
    graph: WorkflowGraph
}) {
    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }

    await saveWorkflowGraph({orgId, id, graph})

     const handle = await tasks.trigger<typeof runWorkflowTask>("run-workflow", 
        { workflowId: id, orgId },
        { tags: [`workflow-${id}`] }
    )

     return handle
}

export async function cancleWorkflowRunAction(runId: string) {
    const { orgId } = await auth()

    if(!orgId) {
        throw new Error("No active organization found")
    }
    
    await runs.cancel(runId)
}