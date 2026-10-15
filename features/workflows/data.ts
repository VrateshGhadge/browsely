import { db } from "@/lib/db"
import { workflows, WorkflowGraph } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"

import { validateGraph } from "@/features/workflows/libs/validate-graph"

export async function saveWorkflowGraph({orgId, id, graph}:{
    orgId: string,
    id: string,
    graph: WorkflowGraph
}) {
    const problems = validateGraph(graph)
    
    if(problems.length > 0) throw new Error(`Workflow is invalid: ${problems.join(" ")}`)
    
    await db
        .update(workflows)
        .set({
            graph,
            updatedAt: new Date()
        })
        .where(
            and(
                eq(workflows.id, id), 
                eq(workflows.orgId, orgId)
            )
        )

}

export function listWorkflows(orgId:string) {
    return db
        .select()
        .from(workflows)
        .where(
            eq(workflows.orgId, orgId)
        )
        .orderBy(desc(workflows.createdAt))
}

export async function getWorkflow(orgId:string, workflowId:string) {
    const [workflow] = await db
        .select()
        .from(workflows)
        .where(
            and(
                eq(workflows.orgId, orgId), 
                eq(workflows.id, workflowId)
            )
        )

    return workflow
}

export async function createWorkflow(orgId:string, name:string) {
    const [workflow] = await db
        .insert(workflows)
        .values({
            orgId,
            name,
        })
        .returning()

    return workflow 
}

export async function deleteWorkflow(orgId:string, id:string) {
    // Delete the workflow where:
    // workflow.id === id
    // AND workflow.orgId === orgId
    const [workflow] = await db
        .delete(workflows)
        .where(
            and(
                eq(workflows.id, id), 
                eq(workflows.orgId, orgId)
            )
        )
        .returning()

    return workflow 
}