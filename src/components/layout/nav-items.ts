import {BookOpen, Home, LucideIcon, MessageCircle, Type} from "lucide-react";

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    /** Extra path prefixes that should also highlight this tab. */
    matches?: string[];
}

export const NAV_ITEMS: NavItem[] = [
    {label: "Today", to: "/", icon: Home},
    {label: "Grammar", to: "/grammar", icon: BookOpen},
    {label: "Words", to: "/words", icon: Type},
    {label: "Ask", to: "/ask", icon: MessageCircle, matches: ["/ask-llama"]},
];

export function isNavItemActive(item: NavItem, pathname: string) {
    if (item.to === "/") return pathname === "/";
    return [item.to, ...(item.matches ?? [])].some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
