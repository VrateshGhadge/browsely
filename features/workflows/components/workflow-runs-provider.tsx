"use client"

import { createContext, useContext, useMemo } from "react"

// for execution updates
// We use useRealtimeRunsWithTag and not useRealtimeRun because...
// We don't know the exact run ID when the editor first opens, and the user might click "Run" multiple times. 
// By subscribing to a tag (like a #hashtag for this specific canvas), we automatically get live updates for ANY run 
// that happens here, without needing to track new IDs.
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"


import type { RunStep, runWorkflowTask } from "@/features/workflows/tasks/run-workflow"


// We use Context here to skip the middle layers (like WorkflowEditor and Canvas) 
// and directly teleport the latest Trigger.dev run information to the individual nodes.
// export const WorkflowRunsContext = createContext<WorkflowRunsContextValue | null>(null)


// Decide what information Context should share
// Remember our goal: individual nodes need to know the status of the latest workflow execution
// For example:
// - Node A → done
// - Node B → running
// - Node C → pending

type WorkflowRun = ReturnType<
  typeof useRealtimeRunsWithTag<typeof runWorkflowTask>
>["runs"][number]

interface WorkflowRunsContextValue {
    runs: WorkflowRun[]
    error?: Error
}



interface WorkflowRunProviderProps {
    workflowId: string
    accessToken: string
    children: React.ReactNode
}

export const WorkflowRunsContext = createContext<WorkflowRunsContextValue | null>(null)

export function WorkflowRunsProvider({ workflowId, accessToken, children }: WorkflowRunProviderProps) {
    const { runs, error } = useRealtimeRunsWithTag<typeof runWorkflowTask>(
        `workflow:${workflowId}`,
        { accessToken }
    )

    const value = useMemo<WorkflowRunsContextValue>(
        () => ({ runs, error }),
        [runs, error]
    )
    return (
        <WorkflowRunsContext.Provider value={value}>
            {children}
        </WorkflowRunsContext.Provider>
    )
}

function useWorkflowRuns() {
  const ctx = useContext(WorkflowRunsContext)
  if (!ctx) {
    throw new Error(
      "useWorkflowRuns must be used within a WorkflowRunsProvider"
    )
  }
  return ctx
}

interface LatestRunSteps {
  steps: RunStep[]
  // True while the latest run is queued or executing — i.e. still producing steps.
  isLive: boolean
}

// The steps of the most recent run, plus whether it's still going. Prefer the
// run's final output steps (guaranteed once it succeeds) and fall back to the
// live metadata steps the task publishes while it runs.
export function useLatestRunSteps(): LatestRunSteps {
  const { runs } = useWorkflowRuns()

  return useMemo<LatestRunSteps>(() => {
    const latest = runs.reduce<WorkflowRun | undefined>((newest, run) => {
      if (!newest || run.createdAt > newest.createdAt) return run
      return newest
    }, undefined)

    if (!latest) return { steps: [], isLive: false }

    const isLive = latest.status === "QUEUED" || latest.status === "EXECUTING"
    const metadataSteps = latest.metadata?.steps as RunStep[] | undefined
    const steps = latest.output?.steps ?? metadataSteps ?? []

    return { steps, isLive }
  }, [runs])
}