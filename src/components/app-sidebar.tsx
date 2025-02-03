import * as React from "react"
import {BookMinus, BookOpen, BookPlus, GraduationCap, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {useGrammarLessons} from "@/hooks/use-grammar-lessons.tsx";

const data = {

    navMain: [
        {
            title: "Grammar - B2",
            url: "#",
            icon: BookMinus,
            items: [],
        },
        {
            title: "Grammar - C1",
            url: "#",
            icon: BookPlus,
            items: [],
        },
        {
            title: "Advanced Grammar",
            url: "#",
            icon: GraduationCap,
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
            icon: SquareTerminal
        },
    ],

}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const grammarLessons = useGrammarLessons();
    if (grammarLessons) {
        data.navMain[2].items = grammarLessons.lessons.map(lesson => ({
            title: lesson.description,
            url: `/grammar/${lesson.title}`
        }));
    }
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
