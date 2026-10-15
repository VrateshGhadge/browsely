//this checks if workflow is valid or not before user clicks "RUN"

import toposort from "toposort";

import type { WorkflowGraph } from "@/lib/db/schema";

export function validateGraph({nodes, edges}: WorkflowGraph): string[] {
    const problems: string[] = [];

    const triggers = nodes.filter((n) => n.data.kind === "trigger").length;

    if(triggers !== 1) {
        problems.push(`Workflow must have exactly one Start trigger (found ${triggers}).`);
    }

    //run will be only executed when the nodes are connected in edges
    if(edges.length === 0) {
        problems.push("Connect your nodes before running the workflow.");
    //if the connection exist then
    } else {
        //checks if the workflow has a cycle[loop] or not
        //If it has a cycle then it will throw an error
        try{
            toposort(edges.map((e) => [e.source, e.target]));
        } catch {
            problems.push("Workflow has a cycle. Please remove cycles before running.");
        }
    }

    return problems;
}