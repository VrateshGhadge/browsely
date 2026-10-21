// Swaps `{{ nodeId.path }}` placeholders in a field for values pulled from
// this run's node outputs (keyed by node id). Pure — the caller supplies the
// outputs map. A placeholder that points at nothing becomes "", and one that
// lands on an object/array drops in its JSON so it survives inside text.

//if you didnt understand the above line, let me explain it to you in simple words.
// This function takes a string with placeholders like {{ nodeId.path }} and replaces them with actual values from the outputs map.
// outputs map in simple words is a record where the keys are node ids and the values are the outputs of those nodes. 
// If a placeholder points to a value that doesn't exist, it will be replaced with an empty string. 
// If a placeholder points to an object or array, it will be replaced with its JSON representation so that it can be used inside text.

export type NodeOutputs = Record<string, unknown>

const PLACEHOLDER = /\{\{\s*([^}]+?)\s*\}\}/g

// This function is useful for safely accessing nested properties in an object without having to check if each level exists. 
// It allows you to get the value at a specific path without worrying about runtime errors if the path doesn't exist.

function getByPath(root: NodeOutputs, path: string): unknown {
  // Convert array syntax into dot notation.
  // Example: "nodeA.items[0].name" → "nodeA.items.0.name"
  const keys = path
    .replace(/\[(\w+)\]/g, ".$1")

    // Split the path into individual keys.
    // "nodeA.items.0.name" → ["nodeA", "items", "0", "name"]
    .split(".")

    // Remove empty strings from the array.
    .filter(Boolean)

  // Walk through the object one key at a time.
  // Start with the complete object: root.
  return keys.reduce<unknown>((acc, key) => {

    // If the current value is missing or isn't an object,
    // we cannot continue, so return undefined.
    if (acc == null || typeof acc !== "object") {
      return undefined
    }

    // Access the next property using the current key.
    return (acc as Record<string, unknown>)[key]

  }, root)
}

export function interpolate({
  text,
  outputs,
}: {
  text: string
  outputs: NodeOutputs
}): string {
  // Find each placeholder in the text and replace it with its actual value.
  return text.replace(PLACEHOLDER, (_match, expr: string) => {
    // Remove extra spaces from the expression and get its value from outputs.
    // Example: " nodeA.name " → getByPath(outputs, "nodeA.name")
    const value = getByPath(outputs, expr.trim())

    // If the value doesn't exist (null or undefined), replace it with an empty string.
    if (value == null) return ""

    // If the value is an object or array, convert it into JSON text.
    if (typeof value === "object") return JSON.stringify(value)

    // Convert other values, such as numbers and booleans, into strings.
    return String(value)
  })
}