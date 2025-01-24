import * as React from "react"
import {BookOpen, Bot, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"

// This is sample data.
const data = {

    navMain: [
        {
            title: "Grammar - B2",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Grammar - C1",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Vocabulary",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Daily Random Item",
                    url: "/",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Ask Llama",
            url: "/ask-llama",
            icon: Bot
        },
    ],

}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>

            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
