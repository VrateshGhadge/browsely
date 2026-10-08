
import { auth } from '@clerk/nextjs/server'
import { notFound } from "next/navigation";
import { getWorkflow } from "@/features/workflows/data";
import { ReactFlowProvider } from '@xyflow/react';

import { Room } from "@/features/workflows/components/room";
import  WorkflowShell  from "@/features/workflows/components/workflow-shell"
import { liveblocks } from '@/lib/liveblocks';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  const workflow = await getWorkflow(orgId, id);

  if (!workflow) {
    notFound();
  }
 
  await liveblocks.getOrCreateRoom(id, {
    organizationId: orgId,
    defaultAccesses: [],
    groupsAccesses: {
      [orgId]: ["room:write"],
    },

    metadata: {
      title: workflow.name,
    },
  });


  // the canvas and the sidebars node pallette live in seperate components, so a single ReactFlowProvider wraps
  // boths to give them access to same react flow state/store
  // this is because in workkflow shell the canvas has the access of useLiveblocksFlow but the right sidebar does not
  //  so we need to wrap both in a single ReactFlowProvider so they can share the same state/store

  return(
    <Room roomId={id}>
      <ReactFlowProvider>
        <WorkflowShell workflowId={id}/>
      </ReactFlowProvider>
    </Room> 
  )
}