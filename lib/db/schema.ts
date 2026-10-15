import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

//edge represents the connection between two nodes
import { Edge } from "@xyflow/react";
import type { StepNodeType } from "@/features/workflows/nodes/node-registry";

// Define the structure of a complete workflow graph.
// A workflow contains nodes (steps) and edges (connections).
export type WorkflowGraph = {
  nodes: StepNodeType[];
  edges: Edge[];
};

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  // Store the workflows nodes and connections as JSON.
  // WorkflowGraph tells TypeScript what shape this JSON should have.
  graph: jsonb("graph").$type<WorkflowGraph>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;