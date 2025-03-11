import * as React from "react"
import {BookMinus, BookOpen, BookPlus, GraduationCap, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {useGrammarLessons} from "@/hooks/use-grammar-lessons.tsx";
import {GrammarLessonLevel} from "@/grammar/GrammarLessonLevel.ts";
import {GrammarLessonsProps} from "@/grammar/GrammarItemProps.ts";

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

function toMenuEntry(grammarLessons: GrammarLessonsProps | undefined) {
    if (grammarLessons) {
        return grammarLessons.lessons.map(lesson => ({
            title: lesson.title,
            url: `/grammar/${lesson.id}`
        }));
    }
    return [];

}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    data.navMain[0].items = toMenuEntry(useGrammarLessons(GrammarLessonLevel.B2));
    data.navMain[1].items = toMenuEntry(useGrammarLessons(GrammarLessonLevel.C1));
    data.navMain[2].items = toMenuEntry(useGrammarLessons(GrammarLessonLevel.ADVANCED_GRAMMAR_CHALLENGE));

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
