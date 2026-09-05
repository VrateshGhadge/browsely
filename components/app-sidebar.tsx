'use client'

import * as React from "react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { PlusIcon, WorkflowIcon } from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar"

const workflows = [
    "domain-scanner",
    "email-verifier",
    "email-scraper",
    "email-sender",
    "linkedin-scraper",
    "linkedin-sender",
    "phone-verifier",
    "phone-scraper",
    "phone-sender",
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [activeWorkflow, setActiveWorkflow] = React.useState(workflows[0])

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
        <SidebarHeader className="flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"> 
            <OrganizationSwitcher 
                hidePersonal
                appearance={{
                    elements:{
                        rootBox: "min-w-0 group-data-[collapsible=icon]:!hidden",
                        organizationSwitcherTrigger: "w-full justify-between",
                    }
                }}
            />
            <SidebarTrigger/>
        </SidebarHeader>
            <SidebarContent>
                <SidebarGroup> 
                    <SidebarGroupLabel> Workflows</SidebarGroupLabel>
                    <SidebarGroupAction title="New workflow">
                        <PlusIcon />
                        <span className="sr-only">New workflow</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-y-0.5">
                            {workflows.map((workflow) => (
                                <SidebarMenuItem key={workflow}>
                                    <SidebarMenuButton
                                        isActive={activeWorkflow === workflow}
                                        onClick={() => setActiveWorkflow(workflow)}
                                        tooltip={workflow}
                                    >
                                        <WorkflowIcon />
                                        <span>{workflow}</span>
                                    </SidebarMenuButton> 
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="group-data-[collapsible=icon]:items-center">
                <UserButton
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            userButtonTrigger: "w-full justify-start group-data-[collapsible=icon]:justify-center",
                            userButtonOuterIdentifier: "group-data-[collapsible=icon]:hidden",
                        }
                    }}
                />
            </SidebarFooter>
    </Sidebar>
  )
}