import * as React from "react"
import {BookOpen, Bot, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"

const data = {

    navMain: [
        {
            title: "Grammar - B2",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [],
        },
        {
            title: "Grammar - C1",
            url: "#",
            icon: Bot,
            items: [],
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
