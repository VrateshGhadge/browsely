"use client"

import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { runWorkflowAction } from "@/features/workflows/actions";
import { useTransition } from "react";

export function RightSidebar() {
    const [isPending, startTransition] =  useTransition()

    const onRun = () => {
        startTransition(async () => {
            await runWorkflowAction("Hello from the right sidebar!")
        })
    }
    return (
        <div className="flex size-full items-center justify-center text-muted-foreground">
            <Button onClick={onRun} disabled={isPending}>
                <PlayIcon />
                Run
            </Button>
        </div>
    )
}