import {ReactNode} from "react";
import {Link, useLocation} from "react-router";
import {Search, Settings} from "lucide-react";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {isNavItemActive, NAV_ITEMS} from "@/components/layout/nav-items.ts";
import {useCommandMenu} from "@/components/layout/CommandMenu.tsx";

function RailLink({to, label, active, children}: { to: string; label: string; active: boolean; children: ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    aria-current={active ? "page" : undefined}
                    aria-label={label}
                    className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors [&_svg]:h-5 [&_svg]:w-5",
                        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                    to={to}
                >
                    {children}
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
    );
}

/**
 * Four destinations instead of a menu tree: an icon rail on wide screens and a
 * bottom tab bar on phones. Lessons live on their own searchable page and in ⌘K.
 */
export function AppShell({children}: { children: ReactNode }) {
    const {pathname} = useLocation();
    const {open: openCommandMenu} = useCommandMenu();

    return (
        // Home-screen mode uses a translucent status bar, so content must clear the notch and side insets itself.
        // Anchored to the top with an explicit height, not inset-0: on iOS 26 home-screen apps the fixed-position
        // viewport ends short of the screen bottom. See --app-height in index.css.
        <div className="fixed inset-x-0 top-0 flex h-[var(--app-height)] overflow-hidden bg-background pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-foreground">
            <nav aria-label="Main" className="hidden w-[68px] shrink-0 flex-col items-center gap-1.5 border-r py-3 md:flex">
                <Link
                    aria-label="English Daily home"
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-primary-foreground"
                    to="/"
                >
                    ED
                </Link>
                {NAV_ITEMS.map(item => (
                    <RailLink active={isNavItemActive(item, pathname)} key={item.to} label={item.label} to={item.to}>
                        <item.icon/>
                    </RailLink>
                ))}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            aria-label="Search lessons (Ctrl K)"
                            className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                            onClick={openCommandMenu}
                            type="button"
                        >
                            <Search className="h-5 w-5"/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Search lessons · ⌘K</TooltipContent>
                </Tooltip>
                <div className="flex-1"/>
                <RailLink active={pathname.startsWith("/admin")} label="Admin" to="/admin/courses">
                    <Settings/>
                </RailLink>
            </nav>

            <div className="flex min-w-0 flex-1 flex-col">
                <main className="flex min-h-0 flex-1 flex-col">{children}</main>

                <nav aria-label="Main" className="grid shrink-0 grid-cols-4 border-t bg-background px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 md:hidden">
                    {NAV_ITEMS.map(item => {
                        const active = isNavItemActive(item, pathname);
                        return (
                            <Link
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex h-[52px] flex-col items-center justify-center gap-0.5 text-[11px]",
                                    active ? "font-semibold text-foreground" : "text-muted-foreground",
                                )}
                                key={item.to}
                                to={item.to}
                            >
                                <item.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.25 : 2}/>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

/** Page header shared by every screen: title, optional subtitle and trailing actions. */
export function PageHeader({title, subtitle, leading, actions, className}: {
    title: ReactNode;
    subtitle?: ReactNode;
    leading?: ReactNode;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <header className={cn("flex shrink-0 items-center gap-2 border-b px-3 py-2.5 md:px-6 md:py-3.5", className)}>
            {leading}
            <div className="flex min-w-0 flex-1 flex-col">
                {subtitle && <span className="truncate text-xs text-muted-foreground">{subtitle}</span>}
                <h1 className="truncate text-[15px] font-semibold md:text-[17px]">{title}</h1>
            </div>
            {actions}
        </header>
    );
}
