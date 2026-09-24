'use client'

import * as React from "react"
import { PlusIcon, WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

import type { Workflow } from "@/lib/db/schema"
import { useTransition } from "react"
import { generateSlug } from "../libs/generate-slug"

interface WorkflowNavProps {
    workflows: Workflow[]
    onCreateWorkflow: (name: string) => Promise<void>
}


export function WorkflowNav({workflows, onCreateWorkflow}: WorkflowNavProps) {
    const { state } = useSidebar()
    const [isPending, setTransition] = useTransition()
    const pathname = usePathname()
    
    const handleCreateWorkflow = () => {
        setTransition(async () => {
            await onCreateWorkflow(generateSlug())
        })
    }

    const [activeWorkflow, setActiveWorkflow] = React.useState(workflows[0])
    const workflowItems = workflows.map((workflow) => (
        <SidebarMenuItem key={workflow.id}>
            <SidebarMenuButton
                asChild
                isActive={pathname === `/workflows/${workflow.id}`}
                onClick={() => setActiveWorkflow(workflow)}
            >
                <Link href={`/workflows/${workflow.id}`}>
                    <span>{workflow.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ))

    if (state === "collapsed") {
        return (
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <SidebarMenuButton tooltip="Workflows">
                                        <WorkflowIcon />
                                        <span>Workflows</span>
                                    </SidebarMenuButton>
                                </PopoverTrigger>
                                <PopoverContent side="right" align="start" className="p-1">
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                onClick={handleCreateWorkflow}
                                                disabled={isPending}
                                            >
                                                <PlusIcon />
                                                <span>New workflow</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                    <SidebarSeparator className="mx-0" />
                                    <SidebarMenu className="gap-y-0.5">{workflowItems}</SidebarMenu>
                                </PopoverContent>
                            </Popover>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        )
    }
    return (
        <SidebarGroup>
            <SidebarGroupLabel> Workflows</SidebarGroupLabel>
            <SidebarGroupAction 
                onClick={handleCreateWorkflow}
                disabled={isPending}
                title="New workflow"
            >
                <PlusIcon />
                <span className="sr-only">New workflow</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu className="gap-y-0.5">{workflowItems}</SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
