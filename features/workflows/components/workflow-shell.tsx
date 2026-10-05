
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { RightSidebar } from "@/features/workflows/components/right-sidebar"
interface WorkflowShellProps{
    workflowId: string
}

import Canvas  from "@/features/workflows/components/canvas"


export default function WorkflowShell({ workflowId } : WorkflowShellProps) {
    return (
        <ResizablePanelGroup orientation="horizontal" className="size-full">
            <ResizablePanel minSize="30rem">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel className="18rem">
                        {/* <div className="flex size-full items-center justify-center text-muted-foreground">
                            Canvas
                        </div> */}
                        <Canvas />
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
                {/* <div className="flex size-full items-center justify-center text-muted-foreground">
                    Inspector
                </div> */}
                <RightSidebar /> 
            </ResizablePanel>
        </ResizablePanelGroup>
  )
}
