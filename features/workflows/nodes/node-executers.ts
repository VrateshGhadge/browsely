

import type { Stagehand } from "@browserbasehq/stagehand";

// we import the ActionNodeType and NodeType from node-registry.ts because we want to use 
// them in this file to define the type of the node that we are creating.
import type { ActionNodeType, NodeType } from "./node-registry";

// we import the openUrl function from open-url.ts because we want to use it 
// in this file to define the action that the node will perform.
import { openUrl } from "./open-url";


// NodeContext is the context that is passed to the node when it is executed. 
// It contains the values of the node's fields and a function to get the Stagehand instance.
export type NodeContext = {
    //the Record<string, string> type is used to define an object that can have any number of properties with string keys and string values.
    values: Record<string, string>
    // the getStagehand function is used to get the Stagehand instance that is used to control the browser.
    // what is stagehand instance? so the Stagehand instance is an object that is used to control the browser.
    // It is created by the Stagehand library and it is used to perform actions in the browser, such as opening a URL, 
    // clicking a button, etc. The getStagehand function is used to get the Stagehand instance that is used to control the browser.
    getStagehand: () => Promise<Stagehand>
}

// NodeExecuter is a function that takes a NodeContext and returns a Promise that resolves to an unknown value.
export type NodeExecutor = (context: NodeContext) => Promise<unknown>


//
// export const nodeExecuters: Partial<Record<NodeType, NodeExecuter>> = {
//     "open-url": async ({ values, getStagehand }) => 
//         openUrl({ stagehand: await getStagehand(), url: values.url })
    
// }   


//nodeExecutors is a partial record that maps NodeType to NodeExecutor.
//in simple words, it is a mapping of node types to the functions that execute them.
// if you didnt understand the above line, let me explain it to you in simple words.
// nodeExecutors is a mapping of node types to the functions that execute them. 
// For example, the "open-url" node type is mapped to the openUrl function, which is executed when the node is run.
// The Partial<Record<NodeType, NodeExecutor>> type means that not all node types need to have an executor defined. 
// Some node types may not have an executor, and that's okay.
//<Record<key, value>>: I am creating an object. I want all the keys on the left side to follow one strict rule, 
// and all the values on the right side to follow another strict rule.
export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
    // if current node type is "open-url" then run the function right next to me."
    // ({ values, getStagehand }) : values is the user input for the node, and 
    // getStagehand is a function that returns the Stagehand instance (browser loaded function).
  "open-url": async ({ values, getStagehand }) =>
    openUrl({ stagehand: await getStagehand(), url: values.url }),
} satisfies Record<ActionNodeType, NodeExecutor>
/*
 * WHY WE USE 'satisfies' HERE:
 * 1. The top definition is Partial<Record<NodeType, ...>> so we are not forced to write executors for "Trigger" nodes.
 * 2. However, we absolutely MUST define executors for all "Action" nodes. 
 * 3. The 'satisfies' keyword acts as a strict double-checker. It looks at the final object and ensures that every 
 *    single action listed in 'ActionNodeType' has been implemented.
 * 4. Safety net: If you add a new action node to the registry in the future but forget to write its executor function here, 
 *    TypeScript will immediately throw an error to warn you.
 */
