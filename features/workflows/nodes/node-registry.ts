import type { Node } from "@xyflow/react"
import { Globe, MousePointerClick, type LucideIcon } from "lucide-react"

export type StepNodeKind = "trigger" | "action"

// One editable field on a node, rendered as an input in the inspector later.
export type NodeField = {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean,
  required?: boolean
}

export type NodeOutput = {
  path: string
  label: string
}


// A node type's manifest entry. Add a node by adding an entry to nodeRegistry.
export type NodeDefinition = {
  type: string
  kind: StepNodeKind
  label: string
  icon: LucideIcon
  accent: string // Tailwind classes for the icon chip color
  fields: NodeField[]
  outputs: NodeOutput[]
}

export const nodeRegistry = {
  start: {
    type: "start",
    kind: "trigger",
    label: "Start",
    icon: MousePointerClick,
    accent: "bg-blue-500 text-white",
    fields: [],
    outputs: [],
  },
  "open-url": {
    type: "open-url",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "bg-emerald-500 text-white",
    fields: [
      { key: "url", label: "URL", placeholder: "https://youtube.com", required: true },
    ],
    outputs: [
      { path: "url", label: "URL" },
      { path: "title", label: "Title" }
    ]
  },
} satisfies Record<string, NodeDefinition>

export type NodeType = keyof typeof nodeRegistry

// Plain JSON only (synced through Liveblocks later). type keys into the registry;
// kind and title are denormalized so the server can read them without the registry.
export type StepNodeData = {
  type: NodeType
  kind: StepNodeKind
  title: string
  values: Record<string, string>
}

export type StepNodeType = Node<StepNodeData, "step">

export type ActionNodeType = {
  //what we want is to get all the node types that are of kind "action" from the nodeRegistry
  // Kind in NodeType
  [K in NodeType]:
    // we have to fetch the type of nodeRegistry[K] and check if its kind is "action"
    // [K] ["kind"] means we first take all the K i.e all the node types and then from that we only take 
    // the ones that are of kind "action"
    (typeof nodeRegistry)[K]["kind"] extends "action"
      // if it is, we return K, otherwise we return never
      ? K
      : never
  // [NodeType] means we remove the "never" types from the union and only keep the ones that are of kind "action"
}[NodeType]


