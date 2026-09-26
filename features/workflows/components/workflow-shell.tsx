
// **Step 1:** Create a WorkflowShell component in features/workflows/components/ that takes a workflowId.
// **Step 2:** Render the component from the workflow page.tsx at app/(dashboard)/workflows/[id]/page.tsx.
// **Step 3:** Build the layout in one file using the Resizable components from components/ui/resizable.tsx, using rem values for every size rather than percentages.
// **Step 4:** Set up the main layout as a horizontal ResizablePanelGroup that fills the space (size-full) with two panels and a handle between them.
// **Step 5:** Configure the left panel as the primary column with a minSize of 30rem.
// **Step 6:** Inside the left panel, create a vertical ResizablePanelGroup split into two panels with a handle between them.
// **Step 7:** Set the top inner panel to a minSize of 18rem for the canvas placeholder.
// **Step 8:** Set the bottom inner panel to a defaultSize of 8rem and a minSize of 6rem for the logs placeholder.
// **Step 9:** Configure the right panel as the inspector with a defaultSize of 16rem, minSize of 14rem, and maxSize of 36rem.
// **Step 10:** Add simple labels in each panel as placeholder content (Canvas, Logs, Inspector) without adding sub-components or data fetching yet.


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


interface WorkflowShellProps{
    workflowId: string
}


export default function WorkflowShell({ workflowId } : WorkflowShellProps) {
    return (
        <ResizablePanelGroup orientation="horizontal" className="size-full">
            <ResizablePanel minSize="30rem">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel className="18rem">
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                            Canvas
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />

                    <ResizablePanel defaultSize="8rem" minSize="6rem">
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                            Logs
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle/>
            <ResizablePanel defaultSize="16rem" minSize="14rem" maxSize="36rem">
                <div className="flex size-full items-center justify-center text-muted-foreground">
                    Inspector
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
  )
}
