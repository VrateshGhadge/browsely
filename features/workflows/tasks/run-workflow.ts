import toposort from "toposort"
import { logger, task } from "@trigger.dev/sdk"

import { getWorkflow } from "@/features/workflows/data"
import { Stagehand, browserbase } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executers"

import { interpolate, type NodeOutputs } from "@/features/workflows/libs/interpolate"


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

    let stagehand: Stagehand | undefined

    const getStagehand = async (): Promise<Stagehand> => {
      // Reuse the existing instance.
      if (stagehand) return stagehand

      // Launch a Browserbase browser.
      // Pass the pre-uploaded Stagehand extension so the SDK skips provisioning it,
      // which would read a bundled zip path that Trigger.dev's build rewrites.
      const browser = await browserbase.launch({
        apiKey: process.env.BROWSERBASE_API_KEY!,
        extensionId: process.env.BROWSERBASE_EXTENSION_ID!,
      })

      // Create Stagehand using the v4 API.
      stagehand = await Stagehand.create({
        browser,
        model: {
          modelName: "google/gemini-2.5-flash",
          apiKey: process.env.GOOGLE_API_KEY!,
        },
      })
  
      return stagehand
    }


    const outputs: NodeOutputs = {}


    // Go through the nodes in the calculated order.
    for (const id of order) {
      // Find the complete node object using its ID.
      const node = byId.get(id)!

      // Log the name of the current step.
      logger.log(`Running step: ${node.data.title}`)

      
      // For example, open a URL or send an email.
      // Report progress so the UI can display the execution status.
      const executor = nodeExecutors[node.data.type]
      if(!executor) continue 
      // if(!executor) continue in simple words means if the executor is not defined for the current node type, 
      // skip this node and move to the next one.

      // Swap {{ nodeId.path }} placeholders for upstream output before running.
      const values = Object.fromEntries(
        Object.entries(node.data.values).map(([key, text]) => [
          key,
          interpolate({ text, outputs }),
        ])
      )
      outputs[id] = await executor({ values, getStagehand })

    }

    await stagehand?.close()
    // Return the number of steps processed by the loop.
    return { steps: order.length }
  },
})