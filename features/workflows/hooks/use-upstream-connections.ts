import { useMemo } from "react"
import { getIncomers, useStore } from "@xyflow/react"

import {
  nodeRegistry,
  type NodeType,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"

// Describes one output from a previous node.
export type UpstreamConnection = {
  token: string     // Placeholder inserted into a field, e.g. {{ node123.title }}
  label: string     // Readable name shown to the user, e.g. "Open URL · Title"
  nodeType: NodeType // Type of the node that produces this output eg. "open-url", so we can render its icon in the picker.
}

export function useUpstreamConnections(): UpstreamConnection[] {
  // Get all nodes and connections from React Flow.
  const nodes = useStore((s) => s.nodes) as StepNodeType[]
  const edges = useStore((s) => s.edges)

  // Find the node currently selected by the user.
  const selected = nodes.find((node) => node.selected)

  return useMemo(() => {
    // If no node is selected, there are no outputs to show.
    if (!selected) return []

    // Store all previous nodes we discover.
    const upstream: StepNodeType[] = []

    // Remember which nodes we've already visited.
    // Start with the selected node to avoid visiting it again.
    //here Set makes sense because we want to avoid duplicates and only keep unique nodes in the upstream array.
    const visited = new Set<string>([selected.id])

    // Start searching from the selected node.
    const queue: StepNodeType[] = [selected]

    // Keep searching while there are nodes left to check.
    while (queue.length > 0) {
      // Take the next node from the front of the queue.
      const current = queue.shift()!

      // Find the nodes directly connected before this node.
      const parents = getIncomers(
        current,
        nodes,
        edges
      ) as StepNodeType[]

      // Process each previous node we found.
      // parent of parents represents one node from the parents array at a time.
      for (const parent of parents) {
        // Skip this node if we've already visited it.
        if (visited.has(parent.id)) continue

        // Remember this node so we don't process it twice.
        visited.add(parent.id)

        // Save it as an upstream node.
        upstream.push(parent)

        // Search its previous nodes next.
        queue.push(parent)
      }
    }

    // Get the available outputs from every upstream node.
    return upstream.flatMap((node) =>
      nodeRegistry[node.data.type].outputs.map((output) => ({
        // Create a placeholder that can be inserted into a field.
        token: `{{ ${node.id}.${output.path} }}`,

        // Create a readable label for the output picker.
        label: `${node.data.title} · ${output.label}`,

        // Keep the node type so the UI can display its icon.
        nodeType: node.data.type,
      }))
    )
  }, [selected, nodes, edges])
}


