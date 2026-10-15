import toposort from "toposort"
import { logger, task } from "@trigger.dev/sdk"

import { getWorkflow } from "@/features/workflows/data"

// Define a background task that runs a saved workflow.
export const runWorkflowTask = task({
  // Unique ID for this Trigger.dev task.
  id: "run-workflow",

  // This function runs when the task is triggered.
  run: async ({
    workflowId,
    orgId,
  }: {
    workflowId: string
    orgId: string
  }) => {
    // Fetch the workflow from the database using its ID and organization ID.
    const workflow = await getWorkflow(orgId, workflowId)

    // Stop execution if the workflow or its saved graph doesn't exist.
    if (!workflow?.graph) {
      throw new Error(`Workflow ${workflowId} has no graph`)
    }

    // Extract the workflow steps (nodes) and their connections (edges).
    const { nodes, edges } = workflow.graph

    // Create a map to find a complete node using its ID.
    // Example: "node-1" -> the Start node object.
    const byId = new Map(nodes.map((node) => [node.id, node]))

    // Collect the IDs of nodes that participate in connections.
    // Nodes without any connections will be skipped.
    const connected = new Set(
      edges.flatMap((edge) => [edge.source, edge.target])
    )

    // Calculate the execution order based on the connections.
    // Toposort arranges nodes so that connected steps run in the correct order.
    const order = toposort
      .array(
        nodes.map((node) => node.id),
        edges.map((edge) => [edge.source, edge.target])
      )
      // Keep only nodes that participate in at least one connection.
      .filter((id) => connected.has(id))

    // Log the workflow name and the number of steps to process.
    logger.log(`Running workflow ${workflow.name}`, {
      steps: order.length,
    })

    // Go through the nodes in the calculated order.
    for (const id of order) {
      // Find the complete node object using its ID.
      const node = byId.get(id)!

      // Log the name of the current step.
      logger.log(`Running step: ${node.data.title}`)

      // TODO: Execute the actual action for this node.
      // For example, open a URL or send an email.
      // Report progress so the UI can display the execution status.
    }

    // Return the number of steps processed by the loop.
    return { steps: order.length }
  },
})