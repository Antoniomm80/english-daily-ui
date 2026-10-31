import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {CheckCircle2, Circle, Settings} from "lucide-react";
import {CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {LEVELS, useAllLessons} from "@/hooks/use-grammar-lessons.tsx";
import {getStudiedLessons} from "@/lib/progress.ts";
import {NAV_ITEMS} from "@/components/layout/nav-items.ts";

const CommandMenuContext = createContext<{ open: () => void }>({open: () => undefined});

export const useCommandMenu = () => useContext(CommandMenuContext);

/** ⌘K / Ctrl+K finder over every page and every grammar lesson. */
export function CommandMenuProvider({children}: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    const {lessons} = useAllLessons();
    const studied = useMemo(() => (isOpen ? getStudiedLessons() : new Set<number>()), [isOpen]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen(value => !value);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    const go = useCallback((to: string) => {
        setOpen(false);
        navigate(to);
    }, [navigate]);

    const value = useMemo(() => ({open: () => setOpen(true)}), []);

    return (
        <CommandMenuContext.Provider value={value}>
            {children}
            <CommandDialog onOpenChange={setOpen} open={isOpen} title="Jump to a lesson or page">
                <CommandInput placeholder="Search lessons and pages…"/>
                <CommandList>
                    <CommandEmpty>No lesson matches that.</CommandEmpty>
                    <CommandGroup heading="Go to">
                        {NAV_ITEMS.map(item => (
                            <CommandItem key={item.to} onSelect={() => go(item.to)} value={`page ${item.label}`}>
                                <item.icon/>{item.label}
                            </CommandItem>
                        ))}
                        <CommandItem onSelect={() => go("/admin/courses")} value="page admin courses">
                            <Settings/>Admin · Courses
                        </CommandItem>
                    </CommandGroup>
                    {LEVELS.map(level => {
                        const levelLessons = lessons.filter(lesson => lesson.level.level === level.level);
                        if (levelLessons.length === 0) return null;
                        return (
                            <CommandGroup heading={level.label} key={level.level}>
                                {levelLessons.map(lesson => (
                                    <CommandItem
                                        key={lesson.id}
                                        onSelect={() => go(`/grammar/${lesson.id}`)}
                                        value={`${lesson.title} ${level.shortLabel} ${lesson.id}`}
                                    >
                                        {studied.has(lesson.id)
                                            ? <CheckCircle2 className="text-brand"/>
                                            : <Circle className="text-muted-foreground/50"/>}
                                        <span className="flex-1 truncate">{lesson.title}</span>
                                        <span className="font-mono text-[11px] text-muted-foreground">{level.shortLabel}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </CommandMenuContext.Provider>
    );
}
