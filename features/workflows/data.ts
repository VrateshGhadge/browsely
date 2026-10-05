import { db } from "@/lib/db"
import { workflows } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"

export function listWorkflows(orgId:string) {
    return db
        .select()
        .from(workflows)
        .where(eq(workflows.orgId, orgId))
        .orderBy(desc(workflows.createdAt))
}

export async function getWorkflow(orgId:string, workflowId:string) {
    const [workflow] = await db
        .select()
        .from(workflows)
        .where(and(eq(workflows.orgId, orgId), eq(workflows.id, workflowId)))

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