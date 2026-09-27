"use client"

import { PlayIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { runWorkflowAction } from "@/features/workflows/actions";
import { useState, useTransition } from "react";

import { useRealtimeRun } from "@trigger.dev/react-hooks";

type RunHandle = {
    runId: string;
    publicAccessToken: string;
};


export function RightSidebar() {
    const [isPending, startTransition] =  useTransition()
    const [handle, setHandle] = useState<RunHandle | null>(null);

    const onRun = () => {
        startTransition(async () => {
            const result = await runWorkflowAction("Hello from the right sidebar!");
            setHandle({
            runId: result.id,
            publicAccessToken: result.publicAccessToken,
            });
        });
        };
    return (
        <div className="flex size-full items-center justify-center text-muted-foreground">
            <Button onClick={onRun} disabled={isPending} >
                {isPending ? <Loader2Icon className="animate-spin" /> : <PlayIcon />}
                Run
            </Button>
            {handle ? <RunStatus handle={handle} /> : null}
        </div>
    )
}

function RunStatus({ handle }: { handle: RunHandle }) {
    const { run, error } = useRealtimeRun(handle.runId, {
        accessToken: handle.publicAccessToken 
    });

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    if (!run) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>Run Status</h3>
            <p>Status: {run.status}</p>
            
            {run.status === "COMPLETED" && run.output? (
                <p className="text-muted-foreground">
                    {(run.output as {message?: string}).message}
                </p>
            ): null} 
        </div>
    );
}