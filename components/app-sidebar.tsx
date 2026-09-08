import * as React from "react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

import { WorkflowNav } from "@/features/workflows/components/workflow-nav"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
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
            <WorkflowNav />
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